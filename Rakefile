require 'rake/clean'

PVERSION = '0.1'
PROJECTNAME = "jsvCard"
PROJECTURL = "http://strategievirali.com/jsvcard/"
BUILDDIR = "build"
OUTFILE = "jsvcard-min.js"

CLEAN.include("#{BUILDDIR}/temp")
CLOBBER.include("#{BUILDDIR}/*")

SRC = FileList['src/base64.js','src/vcard.js','src/jsvcard.js']
LIB =  FileList['lib/iconv.js']

directory "#{BUILDDIR}/temp"
directory "#{BUILDDIR}/doc"
directory "#{BUILDDIR}/lib"
directory "#{BUILDDIR}/test"

task :default => [:build_and_clean]

desc "Builds the project and then clean temporary products."
task :build_and_clean => [:build,:clean]

desc "Builds the project."
task :build => [:jslint,:yuidoc,:minify,:manip_tests]

desc "Runs jslint over the source files."
task :jslint => SRC do
  sh "java -jar lib/jslint4java-1.4.6/jslint4java-1.4.6.jar #{SRC}" 
end

desc "Builds the project docs."
task :yuidoc => ["#{BUILDDIR}/temp","#{BUILDDIR}/doc"] do
  sh "python lib/yuidoc/bin/yuidoc.py src -p #{BUILDDIR}/temp -o #{BUILDDIR}/doc -t lib/yuidoc/template -v #{PVERSION} --project #{PROJECTNAME} --projecturl #{PROJECTURL}"
  sh "cp README #{BUILDDIR}/"
end

desc "Concatenate and compress all javascripts."
task :minify => ["#{BUILDDIR}/temp","#{BUILDDIR}/lib"] do
  my_cat = lambda{|s| sh "cat #{s} >> #{BUILDDIR}/temp/all.js" }
  LIB.each &my_cat
  SRC.each &my_cat
  sh "java -jar lib/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar --type js --charset utf-8 --line-break 80 -o #{BUILDDIR}/lib/#{OUTFILE} #{BUILDDIR}/temp/all.js" 
end

desc "Modify and transfer the test, css and spec pages to destination"
task :manip_tests => ["#{BUILDDIR}/test","#{BUILDDIR}/lib"] do
  # Copy the needed files
  cp "src/jsvcard.css", "#{BUILDDIR}/lib/"
  cp "lib/jquery-1.5.min.js","#{BUILDDIR}/lib/"
  
  # Modify the test & Spec pages
  manip_test_assets("src/test.html","#{BUILDDIR}/test/test.html")
  manip_test_assets("test/SpecRunner.html","#{BUILDDIR}/test/SpecRunner.html")
  
  # Copy the specs files
  cp_r "test/jasmine-1.0.2", "#{BUILDDIR}/test/"
  cp "test/vcard.test.js", "#{BUILDDIR}/test/"
  
end

def manip_test_assets(input,output)
  assets = <<EOT
<script type="text/javascript" src="../lib/#{OUTFILE}"></script>
<link rel="stylesheet" href="../lib/jsvcard.css" />
EOT

  outfile = File.new(output,"w")
  
  File.open(input) do |f|
    removing = false
    f.each_line do |line|
      removing = true if( line =~ /<!--REMOVE-->/ )
      removing = false if( line =~ /<!--\/REMOVE-->/ )
      outfile << assets if( line =~ /<!--ASSETS-->/ )
      outfile << line if( (not removing) && (not line =~ /<!--(.*)-->/) )
    end
  end

end
