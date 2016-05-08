#
# Be sure to run `pod lib lint Tracklytics.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = "Tracklytics"
  s.version          = "0.5.0.1"
  s.summary          = "A Monitoring library for iOS"

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!  
  s.description      = "A Monitoring library for iOS applications."

  s.homepage         = "https://github.com/stefvg/Tracklytics"
  # s.screenshots     = "www.example.com/screenshots_1", "www.example.com/screenshots_2"
  s.license          = 'KU Leuven'
  s.author           = { "Stefvg" => "stefvg1993@gmail.com" }
  s.source           = { :git => "https://github.com/stefvg/Tracklytics.git", :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.platform     = :ios, '7.0'
  s.requires_arc = true

  s.source_files = 'Pod/Classes/**/*'
  s.resource_bundles = {
    'Tracklytics' => ['Pod/Assets/*.png']
  }
  s.resources = 'Pod/Classes/CoreData/*.xcdatamodeld'

  # s.public_header_files = 'Pod/Classes/**/*.h'
  s.frameworks = 'CoreTelephony', 'CoreData'
  # s.dependency 'AFNetworking', '~> 2.3'
end
