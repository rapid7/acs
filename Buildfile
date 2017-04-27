build_name 'acs'

autoversion.create_tags false
autoversion.search_tags false

cookbook.depends 'acs' do |acs|
  acs.path './cookbook'
end

profile :default do |default|
  default.chef.run_list ['acs::nodejs', 'acs::default']
end

profile :test do |test|
  test.chef.run_list ['acs::nodejs', 'acs::test']
end
