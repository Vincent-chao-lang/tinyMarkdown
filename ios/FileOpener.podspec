Pod::Spec.new do |s|
  s.name           = 'FileOpener'
  s.version        = '1.0.0'
  s.summary        = 'Native modules for file operations in tinyMarkdown'
  s.description    = <<-DESC
    Native modules for handling file operations in tinyMarkdown:
    - FileOpenerModule: Check initial files opened from Files app
    - DocumentPickerModule: Pick documents from within the app
    - FileReaderModule: Read file content from file:// URIs
  DESC
  s.homepage       = 'https://github.com/anthropics/claude-code'
  s.license        = 'MIT'
  s.author         = 'tinyMarkdown'
  s.platforms      = { :ios => '13.0' }
  s.source         = { :git => 'https://github.com/anthropics/claude-code.git', :tag => 'v1.0.0' }
  s.source_files   = 'tinyMarkdown/*Module.{h,m}'
  s.dependency 'React-Core'
end
