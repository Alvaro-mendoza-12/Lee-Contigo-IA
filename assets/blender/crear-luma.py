"""Luma: reference-based 3D character, animation rig and transparent renders.

Blender 5.2: blender --background --factory-startup --python crear-luma.py
Use -- --preview for one frame, -- --render-only for the saved scene, and
-- --resume to skip existing frames of the SAME revision. --cpu is portable.
"""

import bpy
import math
import sys
import json
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "assets" / "blender"
FRAMES = ROOT / "artifacts" / "luma-frames"
PUBLIC = ROOT / "public" / "characters" / "luma"
for folder in (SOURCE, FRAMES, PUBLIC):
    folder.mkdir(parents=True, exist_ok=True)

CLIPS = {"saludar": (1, 48), "leer": (49, 96), "pensar": (97, 144), "celebrar": (145, 192), "volar": (193, 240)}


def material(name, color, roughness=0.32, emission=0, coat=0.25, subsurface=0):
    if isinstance(color, str):
        values = [int(color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        color = tuple(c / 12.92 if c < 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in values)
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Coat Weight"].default_value = coat
    shader.inputs["Coat Roughness"].default_value = .18
    shader.inputs["Subsurface Weight"].default_value = subsurface
    if emission:
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = emission
    return mat


def group(name, location, parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.empty_display_type = "SPHERE"
    obj.empty_display_size = 0.13
    obj.parent = parent
    obj.location = location
    return obj


def sphere(name, location, scale, mat, parent, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=32)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    obj.location = location
    obj.scale = scale
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def cube(name, location, scale, mat, parent, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    obj.location = location
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    mod = obj.modifiers.new("Bordes de juguete", "BEVEL")
    mod.width = bevel
    mod.segments = 3
    obj.modifiers.new("Normales suaves", "WEIGHTED_NORMAL")
    return obj


def curve(name, points, radius, mat, parent):
    data = bpy.data.curves.new(name, "CURVE")
    data.dimensions = "3D"
    data.bevel_depth = radius
    data.bevel_resolution = 3
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, co in zip(spline.bezier_points, points):
        point.co = co
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    data.materials.append(mat)
    return obj


def star(name, parent, mat):
    verts = []
    for y in (-0.035, 0.035):
        for i in range(10):
            angle = math.pi / 2 + i * math.pi / 5
            radius = 0.15 if i % 2 == 0 else 0.071
            verts.append((math.cos(angle) * radius, y, math.sin(angle) * radius))
    faces = [tuple(range(9, -1, -1)), tuple(range(10, 20))]
    faces += [(i, (i + 1) % 10, (i + 1) % 10 + 10, i + 10) for i in range(10)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(mat)
    mod = obj.modifiers.new("Puntas suaves", "BEVEL")
    mod.width = 0.025
    mod.segments = 3
    return obj


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def outline(points, steps=12):
    """A closed Catmull-Rom outline, shared by the mouth and wing membranes."""
    result = []
    for i, p1 in enumerate(points):
        p0, p2, p3 = points[i - 1], points[(i + 1) % len(points)], points[(i + 2) % len(points)]
        for j in range(steps):
            t = j / steps
            result.append(tuple(.5 * ((2*p1[k]) + (-p0[k]+p2[k])*t +
                (2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t +
                (-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t) for k in range(2)))
    return result


def face_surface(x, z, offset=.012):
    return -.425 - .25 * math.sqrt(max(.04, 1-(x/.70)**2-((z+.09)/.55)**2)) - offset


def face_patch(name, points, mat, parent, offset=.012):
    edge = outline(points)
    cx, cz = (sum(p[k] for p in edge)/len(edge) for k in range(2))
    vertices = [(cx, face_surface(cx, cz, offset), cz)]
    vertices += [(x, face_surface(x, z, offset), z) for x, z in edge]
    faces = [(0, i+1, (i+1) % len(edge)+1) for i in range(len(edge))]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    mesh.materials.append(mat)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


def pearl_material():
    mat = material("Alas · nácar azul y lila", "#BCEAF2", .22, coat=.6)
    nodes = mat.node_tree.nodes
    shader = nodes.get("Principled BSDF")
    shader.inputs["Transmission Weight"].default_value = .24
    shader.inputs["IOR"].default_value = 1.34
    if "Thin Film Thickness" in shader.inputs:
        shader.inputs["Thin Film Thickness"].default_value = 380
        shader.inputs["Thin Film IOR"].default_value = 1.36
    colors = nodes.new("ShaderNodeVertexColor")
    colors.layer_name = "Nacar"
    mat.node_tree.links.new(colors.outputs["Color"], shader.inputs["Base Color"])
    return mat


def wing_leaf(name, side, upper, mat, vein, rim, parent):
    points = ([(0, 0), (.48, .60), (1.22, .86), (1.36, .69), (.96, .27), (.40, .02)]
              if upper else [(0, 0), (.48, -.04), (1.12, -.30), (1.08, -.49), (.54, -.47), (.12, -.20)])
    edge = outline(points, 14)
    count, rings = len(edge), 10
    cx, cz = (.64, .40) if upper else (.55, -.25)
    vertices = [(side*cx, -.07, cz)]
    radii = [0]
    for ring in range(1, rings+1):
        r = ring/rings
        for x, z in edge:
            vertices.append((side*(cx+(x-cx)*r), -.07*(1-r*r), cz+(z-cz)*r))
            radii.append(r)
    faces = [(0, i+1, (i+1) % count+1) for i in range(count)]
    for ring in range(rings-1):
        a, b = 1+ring*count, 1+(ring+1)*count
        faces += [(a+i, b+i, b+(i+1) % count, a+(i+1) % count) for i in range(count)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    mesh.materials.append(mat)
    colors = mesh.color_attributes.new(name="Nacar", type="FLOAT_COLOR", domain="POINT")
    for i, r in enumerate(radii):
        # Aqua in the membrane, lavender and pearly pink along its silhouette.
        mix = max(0, (r-.55)/.45)
        inner, outer = (.40, .78, .87), (.93, .66, .88)
        colors.data[i].color = (*(inner[k]*(1-mix)+outer[k]*mix for k in range(3)), 1)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    thick = obj.modifiers.new("Membrana de ala", "SOLIDIFY")
    thick.thickness = .014
    border = [(side*x, -.007, z) for x, z in edge]
    border.append(border[0])
    curve("Borde nacarado", border, .009, rim, parent)
    paths = ([[(0, 0), (.44, .26), (.90, .55), (1.22, .73)],
              [(.27, .14), (.48, .44), (.71, .64)],
              [(.48, .29), (.81, .30), (1.08, .41)],
              [(.70, .42), (.81, .61), (.99, .74)]]
             if upper else [[(0, 0), (.42, -.20), (.87, -.36), (1.05, -.38)],
                             [(.33, -.15), (.58, -.15), (.86, -.23)],
                             [(.48, -.23), (.57, -.37), (.70, -.43)]])
    for path in paths:
        curve("Nervadura delicada", [(side*x, -.085, z) for x, z in path], .006, vein, parent)
    return obj


def book_page(name, side, width, height, y_offset, mat, parent):
    vertices, faces = [], []
    segments = 24
    for row in range(2):
        for i in range(segments+1):
            u = i/segments
            x = side*width*u
            y = y_offset-.10*math.sin(u*math.pi/2)
            z = (row-.5)*height+.10*math.sin(u*math.pi*.8)
            vertices.append((x, y, z))
    for i in range(segments):
        faces.append((i, i+1, i+segments+2, i+segments+1))
    if side < 0:
        faces = [face[::-1] for face in faces]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    mesh.materials.append(mat)
    solid = obj.modifiers.new("Grosor", "SOLIDIFY")
    solid.thickness = .024
    bevel = obj.modifiers.new("Esquinas suaves", "BEVEL")
    bevel.width, bevel.segments = .018, 3
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


def bookmark(parent, mat):
    vertices = [(.26, -.235, -.30), (.41, -.24, -.29), (.42, -.26, -.75),
                (.34, -.26, -.68), (.26, -.26, -.75)]
    mesh = bpy.data.meshes.new("Cinta con corte en V")
    mesh.from_pydata(vertices, [], [tuple(range(5))])
    obj = bpy.data.objects.new("Marcapáginas violeta", mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    mesh.materials.append(mat)
    solid = obj.modifiers.new("Tela", "SOLIDIFY")
    solid.thickness = .016
    bevel = obj.modifiers.new("Orilla suave", "BEVEL")
    bevel.width, bevel.segments = .012, 3


def soft_glow(scene):
    tree = bpy.data.node_groups.new("Brillo nacarado · alfa transparente", "CompositorNodeTree")
    tree.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    render = tree.nodes.new("CompositorNodeRLayers")
    glare = tree.nodes.new("CompositorNodeGlare")
    glare.inputs["Type"].default_value = "Fog Glow"
    glare.inputs["Quality"].default_value = "High"
    glare.inputs["Threshold"].default_value = 1.2
    glare.inputs["Strength"].default_value = .24
    glare.inputs["Size"].default_value = .2
    tree.links.new(render.outputs["Image"], glare.inputs["Image"])
    luminance = tree.nodes.new("CompositorNodeRGBToBW")
    tree.links.new(glare.outputs["Glare"], luminance.inputs["Image"])
    mask = tree.nodes.new("ShaderNodeMath")
    mask.operation = "MAXIMUM"
    tree.links.new(render.outputs["Alpha"], mask.inputs[0])
    tree.links.new(luminance.outputs[0], mask.inputs[1])
    alpha = tree.nodes.new("CompositorNodeSetAlpha")
    alpha.inputs["Type"].default_value = "Replace Alpha"
    tree.links.new(glare.outputs["Image"], alpha.inputs["Image"])
    tree.links.new(mask.outputs[0], alpha.inputs["Alpha"])
    output = tree.nodes.new("NodeGroupOutput")
    tree.links.new(alpha.outputs["Image"], output.inputs["Image"])
    scene.compositing_node_group = tree


def configure_device(scene):
    """Device preferences belong to the Blender process, not the .blend file."""
    preferences = bpy.context.preferences.addons["cycles"].preferences
    scene.cycles.device = "CPU"
    try:
        preferences.compute_device_type = "OPTIX"
        preferences.get_devices()
        for device in preferences.devices:
            device.use = device.type == "OPTIX" and "--cpu" not in sys.argv
        if any(device.use for device in preferences.devices):
            scene.cycles.device = "GPU"
    except (TypeError, ValueError):
        pass
    scene.cycles.denoiser = "OPTIX" if scene.cycles.device == "GPU" else "OPENIMAGEDENOISE"
    print("LUMA_RENDER_DEVICE", scene.cycles.device, flush=True)


def build():
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    gold = material("Ámbar · abdomen", "#FFC039", .24, subsurface=.06)
    face = material("Vainilla · rostro", "#FFDEA0", .35, subsurface=.10)
    glow = material("Luz dorada · antenas", "#FFCD51", .18, emission=.3, coat=.5)
    dark = material("Ónix · ojos", "#0D1420", .12, coat=.5)
    pearl = pearl_material()
    vein = material("Nervaduras · blanco azulado", "#E5FFFF", .26, emission=.18)
    rim = material("Bordes iridiscentes", "#F4DEFC", .21, emission=.2)
    cream = material("Hojas de marfil", "#FFF4DA", .42)
    lines = material("Renglones de papel", "#E6D8C3", .75)
    green = material("Jade satinado", "#35BC98", .23, coat=.4, subsurface=.04)
    stalk = material("Verde · antenas", "#197C65", .22, coat=.4)
    bookgreen = material("Cubierta verde", "#36866A", .27, coat=.3)
    pink = material("Mejillas rosadas", "#FF829F", .30, subsurface=.05)
    mouthmat = material("Interior de sonrisa", "#4D120B", .43)
    tongue = material("Lengüita rosa", "#FB7187", .35)
    white = material("Destellos de los ojos", "#FFFFFF", .12, emission=.2)
    lilac = material("Marcapáginas violeta", "#AD7BE1", .33)

    root = group("CTRL · Luma", (0, 0, 0))
    body = group("CTRL · cuerpo", (0, 0, 1.13), root)
    sphere("Cuerpo de jade", (0, .04, -.10), (.57, .36, .70), green, body, 48)
    sphere("Abdomen dorado", (0, -.13, -.50), (.51, .34, .54), gold, body, 48)
    sphere("Barriguita crema", (.03, -.405, -.47), (.28, .11, .39), face, body, 48)
    sphere("Punta de luz", (0, -.08, -.96), (.17, .16, .19), glow, body)
    head = group("CTRL · cabeza", (0, -.035, .88), body)
    sphere("Cabecita redonda de jade", (0, 0, 0), (.84, .53, .72), green, head, 64)
    sphere("Carita de vainilla", (0, -.425, -.09), (.70, .25, .55), face, head, 64)
    for side in (-1, 1):
        x, z = side*.315, -.01
        eye = group("CTRL · ojo " + str(side), (x, face_surface(x, z, .025), z), head)
        sphere("Ojo de ónix brillante", (0, 0, 0), (.126, .075, .165), dark, eye, 48)
        sphere("Reflejo grande", (-.034, -.065, .070), (.041, .016, .044), white, eye, 24)
        sphere("Reflejo pequeño", (.037, -.073, .014), (.014, .009, .016), white, eye, 16)
        x, z = side*.48, -.185
        sphere("Mejilla rosada", (x, face_surface(x,z,.025), z), (.107, .030, .065), pink, head, 48)
        curve("Antena curva", [(side*.28, 0, .62), (side*.39, -.005, .94),
                              (side*.64, -.045, 1.13)], .050, stalk, head)
        sphere("Esfera de luz", (side*.66, -.045, 1.15), (.145, .14, .15), glow, head, 48)
    mouthpoints = [(-.12,-.20), (.015,-.22), (.17,-.18), (.16,-.30), (.10,-.41), (.005,-.43), (-.09,-.35)]
    face_patch("Sonrisa abierta", mouthpoints, mouthmat, head)
    face_patch("Lengüita", [(-.07,-.36), (.015,-.33), (.11,-.35), (.09,-.405), (.005,-.421)], tongue, head, .025)

    wings = []
    arms = []
    for side in (-1, 1):
        wing = group("CTRL · ala " + str(side), (side * .35, .25, .30), body)
        wing_leaf("Ala superior nacarada", side, True, pearl, vein, rim, wing)
        wing_leaf("Ala inferior nacarada", side, False, pearl, vein, rim, wing)
        wings.append(wing)
        arm = group("CTRL · brazo " + str(side), (side * .42, -.05, .27), body)
        hand = sphere("Bracito", (side * .12, -.20, -.20), (.13, .14, .34), green, arm, 48)
        hand.rotation_euler.y = side * -.5
        sphere("Manita redonda", (side * .21, -.74, -.40), (.175, .14, .17), green, arm, 48)
        arms.append(arm)

    book = group("CTRL · libro", (0, -.64, -.14), body)
    book.rotation_euler.x = math.radians(6)
    for side in (-1, 1):
        page = group("Página " + str(side), (0, 0, 0), book)
        # Both curved leaves share a vertical hinge, keeping the spine joined.
        page.rotation_euler.z = side*math.radians(3)
        book_page("Cubierta acolchada", side, .655, .83, .015, bookgreen, page)
        for layer in range(3):
            book_page("Hoja curva " + str(layer), side, .61-layer*.008, .77-layer*.012,
                      -.025-layer*.022, cream, page)
        for line in range(5):
            points = []
            for i in range(6):
                u = .19+i*.12
                points.append((side*.61*u, -.088-.10*math.sin(u*math.pi/2),
                               .23-line*.115+.10*math.sin(u*math.pi*.8)))
            line_obj = curve("Renglón curvo", points, .0045, lines, page)
            line_obj.visible_shadow = False
    curve("Lomo redondeado", [(0,.025,-.40),(0,-.01,0),(0,.01,.38)], .034, bookgreen, book)
    curve("Pliegue de las hojas", [(0,-.080,-.375),(0,-.080,0),(0,-.080,.375)], .012, cream, book)
    bookmark(book, lilac)
    particles = [star("Estrellita " + str(i), root, glow) for i in range(3)]

    reference_path = SOURCE / "referencia-luma.png"
    if reference_path.exists():
        image = bpy.data.images.load(str(reference_path), check_existing=True)
        image.pack()
        reference = group("Referencia del usuario · no renderizar", (4.5, 1, 1.8))
        reference.empty_display_type = "IMAGE"
        reference.data = image
        reference.empty_display_size = 3.4
        reference.rotation_euler.x = math.pi/2
        reference.hide_render = True

    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    configure_device(scene)
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 6
    scene.render.use_persistent_data = True
    scene.render.resolution_x = 448
    scene.render.resolution_y = 448
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.fps = 24
    scene.frame_start, scene.frame_end = 1, 240
    scene.world.use_nodes = True
    scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (.65,.74,.80,1)
    scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = .30
    scene.view_settings.view_transform = "Khronos PBR Neutral"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0
    bpy.ops.object.camera_add(location=(.20, -10, 3.25))
    camera = bpy.context.object
    camera.name = "Cámara · retrato infantil"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 4.1
    aim(camera, (0, 0, 1.72))
    scene.camera = camera
    for name, loc, power, size, color in [
        ("Luz principal suave", (-3, -4, 6), 450, 4.0, (1, .94, .84)),
        ("Relleno menta", (4, -3, 3.5), 250, 3.0, (.83, .96, 1)),
        ("Contorno luminoso", (0, 3, 4.5), 700, 3.0, (.82, 1, .93)),
        ("Reflejo de ojos", (-1, -4, 4.5), 100, 1.2, (1,1,1)),
        ("Rebote cálido bajo el libro", (0,-3,.5), 100, 2.5, (1,.94,.80)),
    ]:
        bpy.ops.object.light_add(type="AREA", location=loc)
        lamp = bpy.context.object
        lamp.name = name
        lamp.data.energy, lamp.data.shape, lamp.data.size = power, "DISK", size
        lamp.data.color = color
        if name.startswith("Rebote") and hasattr(lamp.data, "specular_factor"):
            lamp.data.specular_factor = 0
        aim(lamp, (0, 0, 1.4))
    soft_glow(scene)

    controls = [root, body, head, book, *wings, *arms, *particles]
    eyes = [bpy.data.objects["CTRL · ojo " + str(side)] for side in (-1, 1)]
    controls += eyes
    bases = {obj.name: (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy()) for obj in controls}
    for clip, (start, end) in CLIPS.items():
        for obj in controls:
            obj.animation_data_create()
            obj.animation_data.action = None
        for index in range(49):
            t = index / 48
            frame = start + index
            if index == 48:
                frame = end + 1
            phase = t * math.tau
            envelope = math.sin(math.pi * t) ** 2
            for obj in controls:
                loc, rot, scale = bases[obj.name]
                obj.location, obj.rotation_euler, obj.scale = loc, rot, scale
            root.location.z += .05 * math.sin(phase)
            body.rotation_euler.y = 0.025 * math.sin(phase)
            head.rotation_euler.y = 0.035 * math.sin(phase)
            for i, wing in enumerate(wings):
                wing.rotation_euler.z = (-1 if i == 0 else 1) * (0.08 + 0.08 * math.sin(phase * 3))
            blink = max(0, 1 - abs(t - 0.71) / 0.045)
            for eye in eyes:
                eye.scale.z = 1 - 0.93 * blink
            for particle in particles:
                particle.scale = (0.001,) * 3
            if clip == "saludar":
                raised = math.sin(min(1,t/.18)*math.pi/2)*math.sin(min(1,(1-t)/.18)*math.pi/2)
                arms[1].rotation_euler.y = raised * (-2.15 + .22*math.sin(phase*3))
                arms[1].rotation_euler.x = .34 * raised * math.sin(phase*3)
                head.rotation_euler.y += -.12 * envelope
                head.rotation_euler.z = -.08 * envelope
                book.rotation_euler.z = -.045 * envelope
                root.location.z += .09 * envelope
            elif clip == "leer":
                head.rotation_euler.x = 0.15 * envelope
                head.rotation_euler.z = 0.055 * math.sin(phase)
                book.rotation_euler.x += 0.10 * math.sin(phase)
            elif clip == "pensar":
                head.rotation_euler.y += 0.22 * envelope
                head.rotation_euler.z = 0.16 * envelope
                arms[1].rotation_euler.y = -0.8 * envelope
                arms[1].rotation_euler.x = -0.45 * envelope
            elif clip == "celebrar":
                root.location.z += 0.26 * math.sin(phase * 2) ** 2
                body.rotation_euler.y = 0.13 * math.sin(phase * 2)
                for i, arm in enumerate(arms):
                    arm.rotation_euler.y = (1 if i == 0 else -1) * 1.9 * envelope
                book.location.z += 0.14 * envelope
                for i, particle in enumerate(particles):
                    angle = phase + i * math.tau / 3
                    particle.location = (math.cos(angle) * 1.33, 0, 2.0 + math.sin(angle) * 0.8)
                    particle.rotation_euler.y = phase
                    particle.scale = (envelope,) * 3
            elif clip == "volar":
                # Two gentle arcs, wingbeats and banking, all authored in Blender.
                root.location.x += .25 * math.sin(phase)
                root.location.z += .16 * math.sin(phase * 2)
                root.rotation_euler.y = .10 * math.cos(phase)
                root.rotation_euler.z = -.09 * math.sin(phase)
                body.rotation_euler.x = -.08
                for i, wing in enumerate(wings):
                    side = -1 if i == 0 else 1
                    wing.rotation_euler.z = side * (.08 + .20 * math.sin(phase * 4))
                    wing.rotation_euler.x = .58 * math.sin(phase * 4)
                    wing.rotation_euler.y = side * .16 * math.cos(phase * 4)
            for obj in controls:
                for path in ("location", "rotation_euler", "scale"):
                    obj.keyframe_insert(data_path=path, frame=frame)
        for obj in controls:
            action = obj.animation_data.action
            slot = obj.animation_data.action_slot
            action.name = clip.capitalize() + " · " + obj.name
            action.use_fake_user = True
            obj.animation_data.action = None
            track = obj.animation_data.nla_tracks.new()
            track.name = clip.capitalize()
            strip = track.strips.new(clip.capitalize(), start, action)
            strip.action_slot = slot
            strip.extrapolation = "NOTHING"
            strip.blend_type = "REPLACE"
        scene.timeline_markers.new(clip.capitalize(), frame=start)
    scene.frame_set(CLIPS["volar"][0])
    # Ready-to-edit camera view on opening the .blend.
    for area in bpy.context.screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_perspective = "CAMERA"
            area.spaces.active.shading.type = "MATERIAL"
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / "luma-referencia.blend"))
    # Keep reusable 3D geometry and five named animation clips with the source.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.data.objects:
        if obj.type not in {"CAMERA", "LIGHT"}:
            obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=str(SOURCE / "luma-referencia.glb"), export_format="GLB",
        use_selection=True, export_apply=True, export_animation_mode="NLA_TRACKS",
        export_nla_strips=True, export_frame_range=False,
    )
    return scene


if "--render-only" in sys.argv:
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE / "luma-referencia.blend"))
    scene = bpy.context.scene
    configure_device(scene)
else:
    scene = build()

if "--preview" in sys.argv:
    scene.frame_set(193)
    scene.cycles.samples = 96
    scene.render.resolution_x = scene.render.resolution_y = 1024
    scene.render.filepath = str(FRAMES / "preview.png")
    bpy.ops.render.render(write_still=True)
else:
    for clip, (start, end) in CLIPS.items():
        folder = FRAMES / clip
        folder.mkdir(exist_ok=True)
        for i, frame in enumerate(range(start, end + 1)):
            output = folder / f"{i:02d}.png"
            if output.exists() and "--resume" in sys.argv:
                continue
            scene.frame_set(frame)
            scene.render.filepath = str(output)
            bpy.ops.render.render(write_still=True)
    (PUBLIC / "manifest.json").write_text(json.dumps({
        "name": "Luma", "author": "LeeContigo IA", "source": "assets/blender/luma-referencia.blend",
        "fps": 24, "frames": 48, "columns": 6, "rows": 8, "tileSize": 384, "revision": 3,
        "clips": list(CLIPS), "timeline": CLIPS,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
print("LUMA_DONE", flush=True)
