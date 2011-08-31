require 'rake/clean'

PVERSION = '0.1'
PROJECTNAME = "jsvCard"
PROJECTURL = "http://strategievirali.com/jsvcard/"
BUILDDIR = "build"

CLEAN.include("#{BUILDDIR}/temp")
CLOBBER.include("#{BUILDDIR}/*")

SRC = FileList['src/base64.js','src/vcard.js','src/jsvcard.js']
LIB =  FileList['lib/iconv.js']

directory "#{BUILDDIR}/temp"
directory "#{BUILDDIR}/doc"
directory "#{BUILDDIR}/lib"

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
end

desc "Concatenate and compress all javascripts."
task :minify => ["#{BUILDDIR}/temp","#{BUILDDIR}/lib"] do
  my_cat = lambda{|s| sh "cat #{s} >> #{BUILDDIR}/temp/all.js" }
  LIB.each &my_cat
  SRC.each &my_cat
  sh "java -jar lib/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar --type js --charset utf-8 --line-break 80 -o #{BUILDDIR}/lib/jsvcard-min.js #{BUILDDIR}/temp/all.js" 
end

desc "Modify and transfer the test and spec pages to destination"
task :manip_tests do
end

