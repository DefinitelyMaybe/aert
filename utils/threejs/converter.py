import os, shutil, re, time

# Use local scripts within the node_modules folder
BASE_DIRECTORY = 'libs/three.js/src'
# 'node_modules/three/examples' is the first target
# 'node_modules/three/src' is the second target
OUTPUT_DIRECTORY = 'three/'
# delete contents of output folder and debugging files
CLEAN_OUTPUT_DIR = True

DEBUG = True
DEBUG_ROOT = 'sys/debug/'
""" 
Debugging snippet for later use
if DEBUG:
  debugToFile(regex, str, re.DOTALL, DEBUG_ROOT + 'random.js', name)
 """
BLACKLISTED_FILES = [
  "Earcut", # doesn't have a .d.ts file. No types, no typescript
  "PMREMGenerator" # scripts within scripts breaks my pattern matching :(
]


class NewScript(object):
  def __init__(self, filename):
    # how to deal with comments?
    #TODO list all ts/js keywords and put in appropriate order
    self.name = filename
    self.imports = []
    self.globalvars = []
    self.classes = []
    self.functions = []
    self.exports = []

  def __str__(self):
    outstring = ""
    for i in self.imports:
      outstring += str(i) + "\n"
    outstring += "\n"
    for g in self.globalvars:
      outstring += str(g)
    for c in self.classes:
      outstring += str(c)
    for f in self.functions:
      outstring += str(f)
    for e in self.exports:
      outstring += str(e)
    return outstring

  def addimport(self, string):
    self.imports += [string]

  def addGlobalVar(self, string):
    self.globalvars += [string]

  def addClass(self, string):
    self.classes += [string]

  def addFunction(self, string):
    self.functions += [string]

  def addExport(self, string):
    self.exports += [string]

class ScriptClass(object):
  def __init__(self, name):
    self.name = name
    self.extends = ""
    self.implements = ""
    self.abstract = ""
    self.comment = ""
    self.body = ""
    self.vars = []
    self.args = []
    self.methods = []

  def __str__(self):
    # later on you could sort the methods by name
    outputString = "{}\nexport class {}".format(self.comment, self.name)
    if self.extends != "":
      outputString += " extends {}".format(self.extends)
    outputString += " {\n"

    # do I add vars or should they be part of the constructor?
    for v in self.vars:
      outputString += v
    outputString += "\n"

    # add methods
    for method in self.methods:
      outputString += str(method) + "\n"
    
    outputString += self.body + "\n"

    outputString += "}\n\n"
    return outputString

  def parseBody(self, body):
    body = re.sub(r"\t", "", body)

    re_constructor_args = r"\nconstructor\((?P<args>.+?)?\);"
    m = re.search(re_constructor_args, body, flags=re.DOTALL)
    if m != None:
      x = m.groupdict()
      newMethod = ClassMethod('constructor')
      newMethod.args = x['args']
      self.methods += [newMethod]
    body = re.sub(re_constructor_args, "", body, flags=re.DOTALL)

    # comments are problematic here
    re_methods_empty_args = r"\n(?P<name>[\w<> ]+?)\(\): (?P<return>.+?);"
    for m in re.finditer(re_methods_empty_args, body, flags=re.DOTALL):
      x = m.groupdict()
      newMethod = ClassMethod(x['name'])
      newMethod.returns = x['return']
      self.methods += [newMethod]
    body = re.sub(re_methods_empty_args, "", body, flags=re.DOTALL)

    # comments are problematic here
    re_methods = r"\n(?P<name>[\w<> ]+)\((?P<args>.+?)?\): (?P<return>[\w| \[\]]+?);"
    for m in re.finditer(re_methods, body, flags=re.DOTALL):
      x = m.groupdict()
      newMethod = ClassMethod(x['name'])
      newMethod.returns = x['return']
      newMethod.args = x['args']
      self.methods += [newMethod]
    body = re.sub(re_methods, "", body, flags=re.DOTALL)

    # comments are problematic here
    re_methods_return_object = r"\n(?P<name>[\w<> ]+)\((?P<args>.+?)?\): (?P<return>{.+?};)"
    for m in re.finditer(re_methods_return_object, body, flags=re.DOTALL):
      x = m.groupdict()
      newMethod = ClassMethod(x['name'])
      newMethod.returns = x['return']
      newMethod.args = x['args']
      self.methods += [newMethod]
    body = re.sub(re_methods_return_object, "", body, flags=re.DOTALL)
 
    # comments aren't a problem with this just yet...
    re_anon_func = r"\n(?P<name>\w+): \((?P<args>[\w\n|,: ]+?)?\) => (?P<return>.+?;)"
    for m in re.finditer(re_anon_func, body, flags=re.DOTALL):
      x = m.groupdict()
      newMethod = ClassMethod(x['name'])
      if x['args'] != None:
        newMethod.args = x['args']
      newMethod.returns = x['return']
      self.methods += [newMethod]
    body = re.sub(re_anon_func, "", body, flags=re.DOTALL)

    # comments are problematic here (?P<comment>\n/\*.+?\*/)?
    re_objects = r"\n(?P<name>\w+)(?P<optional>\?)?: (?P<othertypes>[\w |]+?)?(?P<type>{.+?}(\[\])?;)"
    for m in re.finditer(re_objects, body, flags=re.DOTALL):
      self.vars += [m.group()]
    body = re.sub(re_objects, "", body, flags=re.DOTALL)

    # comments are problematic here (?P<comment>\n/\*.+?\*/)?
    re_variables = r"\n((readonly )|(static ))?(?P<name>\w+)(?P<optional>\?)?: (?P<type>[\w\[\] |'<>]+?);"
    for m in re.finditer(re_variables, body):
      self.vars += [m.group()]
    body = re.sub(re_variables, "", body, flags=re.DOTALL)

    # removing all comments
    body = re.sub(r"//.+?\n", "", body)
    body = re.sub(r"\n/\*.+?\*/", "", body, flags=re.DOTALL)

    # it is assumed that there is only whitespace at this point
    # but lets check that
    # checking that we've found everything from each script
    bodysubbed = re.sub(r"\s+", "", body)
    if (len(bodysubbed) != 0) and DEBUG:
      with open(DEBUG_ROOT + 'Output_ClassBody.js', 'a') as f:
        f.write("//-------------------- {} ---------------------\n".format(self.name))
        f.write(body.strip())
        f.write("\n")
    #self.body = body

class ScriptInterface(object):
  def __init__(self, name):
    # how to deal with comments?
    self.name = name
    self.comment = ""
    self.body = ""
    self.vars = []
    self.methods = []

  def __str__(self):
    # later on you could sort the methods by name
    outputString = "{}\nexport interface {}".format(self.comment, self.name)
    outputString += " {\n"

    # add methods
    for method in self.methods:
      outputString += str(method) + "\n"
    
    outputString += self.body + "\n"

    outputString += "}\n\n"
    return outputString

  def parseBody(self, body):
    #TODO: work through parsing interface bodys
    body = re.sub(r"\t", "", body)

    re_methods_empty_args = r"(?P<comment>\n/\*.+?\*/)?\n(?P<name>[\w<> ]+)\(\): (?P<return>.+?);"
    for m in re.finditer(re_methods_empty_args, body, flags=re.DOTALL):
      self.methods += [m.group()]
    body = re.sub(re_methods_empty_args, "", body, flags=re.DOTALL)

    re_methods = r"(?P<comment>\n/\*.+?\*/)?\n(?P<name>[\w<> ]+)\((?P<args>.+?)?\): (?P<return>[\w| \[\]]+?);"
    for m in re.finditer(re_methods, body, flags=re.DOTALL):
      self.methods += [m.group()]
    body = re.sub(re_methods, "", body, flags=re.DOTALL)

    re_methods_return_object = r"(?P<comment>\n/\*.+?\*/)?\n(?P<name>[\w<> ]+)\((?P<args>.+?)?\): (?P<return>{.+?};)"
    for m in re.finditer(re_methods_return_object, body, flags=re.DOTALL):
      self.methods += [m.group()]
    body = re.sub(re_methods_return_object, "", body, flags=re.DOTALL)

    re_anon_func = r"(?P<comment>\n/\*.+?\*/)?\n(?P<name>\w+): \(\) => (?P<return>.+?;)"
    for m in re.finditer(re_anon_func, body, flags=re.DOTALL):
      self.vars += [m.group()]
    body = re.sub(re_anon_func, "", body, flags=re.DOTALL)

    re_objects = r"(?P<comment>\n/\*.+?\*/)?\n(?P<name>\w+)(?P<optional>\?)?: (?P<othertypes>[\w |]+?)?(?P<type>{.+?}(\[\])?;)"
    for m in re.finditer(re_objects, body, flags=re.DOTALL):
      self.vars += [m.group()]
    body = re.sub(re_objects, "", body, flags=re.DOTALL)

    # removing all one line comments
    body = re.sub(r"//.+?\n", "", body)

    # it is assumed that there is only whitespace at this point
    # but lets check that
    # checking that we've found everything from each script
    bodysubbed = re.sub(r"\s+", "", body)
    if (len(bodysubbed) != 0) and DEBUG:
      with open(DEBUG_ROOT + 'Output_Interface.js', 'a') as f:
        f.write("//-------------------- {} ---------------------\n".format(self.name))
        f.write(body.strip())
        f.write("\n")
    #self.body = body

class ClassMethod(object):
  def __init__(self, name):
    self.name = ''
    self.args = ''
    self.body = ''
    self.returntype = ''

  def __str__(self):
    if self.returntype != '':
      output = "{} ({}): {} ".format(self.name, self.args, self.returntype)
    else:
      output = "{} ({}) ".format(self.name, self.args)
    output += "{\n"
    output += self.body + "\n}"
    return output

def main():
  # Clean directory
  if os.path.exists(OUTPUT_DIRECTORY) and CLEAN_OUTPUT_DIR:
    shutil.rmtree(OUTPUT_DIRECTORY)
  if DEBUG:
    if os.path.exists(DEBUG_ROOT):
      shutil.rmtree(DEBUG_ROOT)
      writeNewDirFromPath(DEBUG_ROOT)
    else:
      writeNewDirFromPath(DEBUG_ROOT)

  # create a list of all the files to create
  filesList = getFilesList(BASE_DIRECTORY, "")
  lists = splitFilesList(filesList)
  
  # scripts have corresponding .d.ts and .js files
  for file in lists["scripts"]:
    outputPath = "{}/{}.ts".format(OUTPUT_DIRECTORY, file)
    writeNewDirFromPath(outputPath)
    with open(outputPath, 'w') as f:
      newScript = recreateScript(file)
      f.write(newScript)
  
  # .glsl files can be instantly converted to .ts files
  for file in lists["glsl"]:
    inputpath = "{}/{}.glsl.js".format(BASE_DIRECTORY, file)
    outputPath = "{}/{}.glsl.ts".format(OUTPUT_DIRECTORY, file)
    writeNewDirFromPath(outputPath)
    with open(inputpath, 'r') as fin:
      data = fin.read()
      with open(outputPath, 'w') as fout:
        fout.write(data)
  
  # could think about doing the blacklisted files later
  """ for file in lists["black"]:
    inputpath = "{}/{}.js".format(BASE_DIRECTORY, file)
    outputPath = "{}/{}.ts".format(OUTPUT_DIRECTORY, file)
    writeNewDirFromPath(outputPath)
    with open(inputpath, 'r') as fin:
      data = fin.read()
      with open(outputPath, 'w') as fout:
        fout.write(data) """

def writeNewDirFromPath(filename):
  if not os.path.exists(os.path.dirname(filename)):
    try:
      os.makedirs(os.path.dirname(filename))
    except OSError: # Guard against race condition
      raise

def getFilesList(basedir, filePath):
  fList = []
  for f in os.listdir("{}/{}".format(basedir, filePath)):
    if filePath == "":
      fp = f
    else:
      fp = "{}/{}".format(filePath, f)
    if os.path.isdir("{}/{}".format(basedir, fp)):
      fList += getFilesList(basedir, fp)
    else:
      if f == ".DS_Store":
        continue
      filename = [x for x in f.split(".")][0]
      fn = "{}/{}".format(filePath, filename)
      if not fn in fList:
        fList += [fn]
  return fList

def splitFilesList(fileList):
  # simply assuming these files are only held in specific dirs
  glslList = []
  scriptsList = []
  blackList = []
  for f in fileList:
    if glslChecker(f):
      # glsl don't need any extra work
      glslList += [f]
    elif blackListChecker(f):
      print("{} has been moved to the black list".format(f))
      blackList += [f]
    else:
      # scripts are expected to have .d.ts and .js files
      # with the same base file name
      scriptsList += [f]
  return {
    "glsl": glslList,
    "scripts": scriptsList,
    "black": blackList
  }

def glslChecker(filepath):
  x = filepath.split("/")
  if "ShaderChunk" in x or "ShaderLib" in x:
    if x[-1] != "ShaderChunk" and x[-1] != "ShaderLib":
      return True
  return False

def blackListChecker(filepath):
  for x in BLACKLISTED_FILES:
      if x in filepath:
        return True
  return False

def recreateScript(file):
  # ---------------------------------------------------------------------
  # 1 - match the re
  # 2 - send matched re.group to be processed further
  # 3 - remove re from string
  # 4 - go back to 1 as neccessary
  # start with most specific re's and go down to general re's
  # ---------------------------------------------------------------------
  template = open("{}/{}.d.ts".format(BASE_DIRECTORY, file,), 'r').read()
  script = open("{}/{}.js".format(BASE_DIRECTORY, file,), 'r').read()
  filename = file.split("/")[-1]
  newScript = NewScript(filename)

  # most of my regex's are looking for \nstuff\n} but 
  # some template/scripts don't so I add \n
  template = "\n" + template
  script = "\n" + script

  # TODO: redo comments in some way. they're over matching. r'(?P<comment>\n/\*.+?\*/)?'
  # ------ imports --------
  re_import = r"(import {.+?} from .+?;)|(import '.+?';)|(import \* as \w+ from .+?;)|(import \w+ from '.+?';)"
  for m in re.finditer(re_import, script):
    newScript.addimport(re.sub(".js';", "';", m.group()))
  script = re.sub(re_import, "", script, flags=re.DOTALL)
  template = re.sub(re_import, "", template, flags=re.DOTALL)
  
  # ------ exports ---------
  re_export = r"(\nexport {.+?};)|(export {.+?} from .+?;)|(export \* from .+?;)"
  """ for m in re.finditer(re_export, script, flags=re.DOTALL):
    newScript.addExport(m.group()) """
  template = re.sub(re_export, "", template, flags=re.DOTALL)
  script = re.sub(re_export, "", script, flags=re.DOTALL)

  # ------ class ----------
  # for the moment its speific classes
  re_class_extends = r"(?:\n)(?:export )?(?:class )(?P<class>[\w<> ]+)(?: extends )(?P<extends>[\w<> ]+)(?: {)(?P<body>.+?)(\n})"
  re_class_implements = r"(?:\nexport class )(?P<class>\w+)(?: implements )(?P<implements>\w+)(?: {)(?P<body>.+?)(\n})"
  re_class_abstract = r"(?:\nexport abstract class )(?P<class>\w+)(?: {)(?P<body>.+?)(\n})"
  for m in re.finditer(re_class_extends, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newClass = ScriptClass(namedGroups["class"])
    newClass.extends = namedGroups["extends"]
    body = namedGroups["body"]
    newClass.parseBody(body)
    newScript.addClass(newClass)
  for m in re.finditer(re_class_implements, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newClass = ScriptClass(namedGroups["class"])
    newClass.implements = namedGroups["implements"]
    body = namedGroups["body"]
    newClass.parseBody(body)
    newScript.addClass(newClass)
  for m in re.finditer(re_class_abstract, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newClass = ScriptClass(namedGroups["class"])
    newClass.abstract = True
    body = namedGroups["body"]
    newClass.parseBody(body)
    newScript.addClass(newClass)
  for m in re.finditer(re_class_extends, script, flags=re.DOTALL):
    #TODO: if the script has this syntax, how much does it really need done to it?
    print("does {} need to be reformatted?".format(file))
    namedGroups = m.groupdict()
    newClass = ScriptClass(namedGroups["class"])
    newClass.extends = namedGroups["extends"]
    body = namedGroups["body"]
    newClass.parseBody(body)
    newScript.addClass(newClass)
  template = re.sub(re_class_extends, "", template, flags=re.DOTALL)
  template = re.sub(re_class_abstract, "", template, flags=re.DOTALL)
  template = re.sub(re_class_implements, "", template, flags=re.DOTALL)
  script = re.sub(re_class_extends, "", script, flags=re.DOTALL)

  # -------- interfaces -------------
  re_exported_interfaces = r"(?:\nexport interface )(?P<interface>\w+)(?P<body>.+?)(\n})"
  re_interfaces = r"(?:\ninterface )(?P<interface>\w+)(?P<body>.+?)(\n})"
  for m in re.finditer(re_class_implements, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newInterface = ScriptInterface(namedGroups["interface"])
    body = namedGroups["body"]
    newInterface.parseBody(body)
    #TODO: do i need a different method for adding various code sections/types
    newScript.addClass(newInterface)
  for m in re.finditer(re_interfaces, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newInterface = ScriptInterface(namedGroups["interface"])
    body = namedGroups["body"]
    newInterface.parseBody(body)
    #TODO: do i need a different method for adding various code sections/types
    newScript.addClass(newInterface)
  template = re.sub(re_exported_interfaces, "", template, flags=re.DOTALL)
  template = re.sub(re_interfaces, "", template, flags=re.DOTALL)

  # ---- namespaces --------
  re_namespaces = r"(?:\nexport namespace )(?P<namespace>\w+)(?P<body>.+?)(\n})"
  re_export_as_namespace = r"(?:\nexport as namespace )(?P<namespace>\w+;)(?=\n)"
  for m in re.finditer(re_namespaces, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    #newScript.addClass(m.group())
    #TODO what is within these re matchs?
  m = re.search(re_export_as_namespace, template, flags=re.DOTALL)
  if m != None:
    newScript.addExport(m.group())
  template = re.sub(re_namespaces, "", template, flags=re.DOTALL)
  template = re.sub(re_export_as_namespace, "", template, flags=re.DOTALL)

  # ----- general classes -------
  re_class_base = r"(?:\nexport class )(?P<class>\w+)(?: {)(?P<body>.+?)(\n})"
  for m in re.finditer(re_class_base, template, flags=re.DOTALL):
    namedGroups = m.groupdict()
    newClass = ScriptClass(namedGroups["class"])
    body = namedGroups["body"]
    newClass.parseBody(body)
    newScript.addClass(newClass)
  template = re.sub(re_class_base, "", template, flags=re.DOTALL)

  # object.assign's
  re_named_object_assign = r"\n\w+.prototype = Object.assign\((?P<body>.+?)(\n})( +?\);)?"
  re_instant_object_assign = r"\nObject.assign\((?P<body>.+?)(\n})( +?\);)?"
  # there is one file with a one line instant assign 'renderers/webxr/WebXRManager'
  re_instant_object_assign_singleline = r"\nObject.assign\((?P<body>.+?)(\);)"
  #TODO Object.assigns will probably be going back and looking at classes and adding in this data.
  #TODO Look into Object.assign() and object.create(). these may end up just creating new classes?
  script = re.sub(re_instant_object_assign, "", script, flags=re.DOTALL)
  script = re.sub(re_instant_object_assign_singleline, "", script, flags=re.DOTALL)
  script = re.sub(re_named_object_assign, "", script, flags=re.DOTALL)

  # prototypes
  re_prototype = r"\n\w+\.prototype\.\w+ = (function .+? {)(?P<body>.+?)(\n})(?:[; \)]+)?"
  #TODO: Similar to Object.assigns, check out how this needs to fit in with the script/class
  script = re.sub(re_prototype, "", script, flags=re.DOTALL)

  # functions
  re_named_object_functions = r"(?:\n[\w\.]+?)(?: = function )(.+?)(\n};)"
  script = re.sub(re_named_object_functions, "", script, flags=re.DOTALL)

  # define or set properties
  re_object_define_property = r"\nObject.defineProperty\((?P<body>.+?)(\n} \);)"
  re_object_define_properties = r"\nObject.defineProperties\((?P<body>.+?)\n} \);"
  re_object_set_property = r"\n.+?\.prototype\.(?P<property>\w+) = (?P<value>.+?);"
  script = re.sub(re_object_define_property, "", script, flags=re.DOTALL)
  script = re.sub(re_object_define_properties, "", script, flags=re.DOTALL)
  script = re.sub(re_object_set_property, "", script)

  # create
  re_object_create = r"\n\w+?.prototype = Object.create\(.+?\);"
  # simply removing these code sections
  script = re.sub(re_object_create, "", script)

  # constructors
  re_object_constructor = r"\n.+?\.prototype\.constructor = .+?;"
  script = re.sub(re_object_constructor, "", script)

  # top level if statements
  re_if_statements = r"\nif \(.+?\n}"
  script = re.sub(re_if_statements, "", script, flags=re.DOTALL)
  
  # functions
  re_function = r"\nfunction \w+\((?P<body>.+?)\n}"
  re_function_singleline = r"\nfunction \w+\((?P<body>.+?)(?:})"
  re_export_function_multiline = r"(?:\nexport function )(?P<name>\w+)(?P<body>.+?)(?:\n})"
  re_export_function_singleline = r"(?:\nexport function )(?P<name>\w+)(?P<body>.+?)(?:;)"

  script = re.sub(re_function, "", script, flags=re.DOTALL)
  script = re.sub(re_function_singleline, "", script)
  template = re.sub(re_export_function_singleline, "", template)
  template = re.sub(re_export_function_multiline, "", template, flags=re.DOTALL)
  # there is a single script file that has exported functions - 'renderers/shaders/UniformsUtils.js'
  script = re.sub(re_export_function_multiline, "", script, flags=re.DOTALL)

  #objects
  re_objects = r"\n\w.+? = {(?P<body>.+?)(\n};)" # does this need a ;?
  script = re.sub(re_objects, "", script, flags=re.DOTALL)
  template = re.sub(re_objects, "", template, flags=re.DOTALL)

  # variables
  re_vars = r"(?:\nvar )(.+?;)(?=\n)"
  re_export_vars = r"(?:\nexport var )(.+?;)"
  re_export_let = r"(?:\nexport let )(.+?\n};)"
  re_export_let_singleline = r"(?:\nexport let )(.+?;)"
  re_export_const = r"(?:\nexport const )(.+?;)"
  script = re.sub(re_export_vars, "", script,flags=re.DOTALL)
  script = re.sub(re_vars, "", script, flags=re.DOTALL)
  template = re.sub(re_export_let, "", template, flags=re.DOTALL)
  template = re.sub(re_export_let_singleline, "", template, flags=re.DOTALL)
  template = re.sub(re_export_const, "", template, flags=re.DOTALL)

  # enums
  re_export_enum_multiline = r"(?:\nexport enum )(.+?\n})"
  re_export_enum_singleline = r"(?:\nexport enum )(.+?})"
  template = re.sub(re_export_enum_singleline, "", template)
  template = re.sub(re_export_enum_multiline, "", template, flags=re.DOTALL)

  # types
  re_export_type = r"(?:\nexport type )(.+?;)"
  template = re.sub(re_export_type, "", template, flags=re.DOTALL)

  # class defaults
  re_class_defaults = r"(\n[\w.]+ = )(.+?;)(?=\n)"
  script = re.sub(re_class_defaults, "", script, flags=re.DOTALL)

  # comments not attached to functions, vars, classes etc...
  re_last_comments = r"(?P<comment>(//.+?\n)+|(/\*.+?\*/))"
  script = re.sub(re_last_comments, "", script, flags=re.DOTALL)
  template = re.sub(re_last_comments, "", template, flags=re.DOTALL)

  # checking that we've found everything from each script
  t = re.sub(r"\s+", "", template)
  s = re.sub(r"\s+", "", script)
  if (len(t) != 0) or (len(s) != 0) and DEBUG:
    with open(DEBUG_ROOT+ 'Output_Removal.js', 'a') as f:
      f.write("//-------------------- {} ---------------------\n".format(file))
      f.write("//------------ template - {} --------------\n".format(len(template)))
      f.write(template.strip())
      f.write("\n")
      f.write("//------------ script - {} --------------\n".format(len(script)))
      f.write(script.strip())
      f.write("\n")
  return str(newScript)

def debugToFile(regex, string, flagsopt, outputfile, inputFileName):
  for m in re.finditer(regex, string, flags=flagsopt):
    try:
      with open(outputfile, 'a') as f:
        f.write("//-------------- {} ---------------\n".format(inputFileName))
        f.write(m.group() + "\n")
    except:
      with open(outputfile, 'w') as f:
        f.write("//-------------- {} ---------------\n".format(inputFileName))
        f.write(m.group() + "\n") 

if __name__ == "__main__":
  s = time.time()
  main()
  f = time.time()
  print("It took {} seconds to parse three.js".format(round(f-s, 2)))

  if DEBUG:
    files = getFilesList(DEBUG_ROOT, "")
    print("Debugging output is in {}".format(DEBUG_ROOT))
    for f in files:
      path = f[1:] + '.js'
      with open("{}{}".format(DEBUG_ROOT, path), 'r') as file:
        data = file.readlines()
        print("{}\tlines in\t{}".format(len(data), path))