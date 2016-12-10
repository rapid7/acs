default['acs']['user'] = 'acs'
default['acs']['group'] = 'acs'

default['acs']['paths']['directory'] = '/opt/acs'
default['acs']['paths']['executable'] = ::File.join(node['acs']['paths']['directory'], 'bin/server.js')
default['acs']['paths']['configuration'] = '/etc/acs/config.json'

default['acs']['config'] = Mash.new
default['acs']['version'] = nil
default['acs']['enable'] = true
