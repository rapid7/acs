#
# Cookbook Name:: acs
# Recipe:: default
#
# Copyright (C) 2016 Rapid7 LLC.
#
# Distributed under terms of the MIT License. All rights not explicitly granted
# in the MIT license are reserved. See the included LICENSE file for more details.
#

#######################
## Install NodeJS 4.x
#
# This should be moved into a shared cookbook
##
include_recipe 'apt::default'

apt_repository 'nodejs-4x' do
  uri 'https://deb.nodesource.com/node_4.x'
  distribution node['lsb']['codename']
  components ['main']
  key 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key'
end

package 'nodejs'
#######################

node.default['acs']['version'] = cookbook_version

group node['acs']['group'] do
  system true
end

user node['acs']['user'] do
  comment 'acs operator'
  system true

  gid node['acs']['group']
  home node['acs']['paths']['directory']
end

## Fetch and install acs
remote_file 'acs' do
  source ACS::Helpers.github_download('rapid7', 'acs', node['acs']['version'])
  path ::File.join(Chef::Config['file_cache_path'], "acs-#{node['acs']['version']}.deb")

  action :create_if_missing
  backup false
end

version_dir = "#{ node['acs']['paths']['directory'] }-#{ node['acs']['version'] }"

package 'acs' do
  source resources('remote_file[acs]').path
  provider Chef::Provider::Package::Dpkg
  notifies :run, "execute[chown #{version_dir}]"
end

## Symlink the version dir to the specified acs directory
link node['acs']['paths']['directory'] do
  to version_dir
  owner node['acs']['user']
  group node['acs']['group']

  notifies :restart, 'service[acs]' if node['acs']['enable']
end

## Chown the contents of the versioned acs directory to the acs user/group
execute "chown #{version_dir}" do
  command "chown -R #{node['acs']['user']}:#{node['acs']['group']} #{version_dir}"
  user 'root'
  action :nothing
end

## Upstart Service
template '/etc/init/acs.conf' do
  owner node['acs']['user']
  group node['acs']['group']

  source 'upstart.conf.erb'
  variables(
    :description => 'acs configuration service',
    :user => node['acs']['user'],
    :executable => node['acs']['paths']['executable'],
    :flags => [
      "-c #{node['acs']['paths']['configuration']}"
    ]
  )

  notifies :restart, 'service[acs]' if node['acs']['enable']
end

directory 'acs-configuration-directory' do
  path ::File.dirname(node['acs']['paths']['configuration'])

  owner node['acs']['user']
  group node['acs']['group']
  mode '0755'

  recursive true
end

template 'acs-configuration' do
  path node['acs']['paths']['configuration']
  source 'json.erb'

  owner node['acs']['user']
  group node['acs']['group']

  variables(:properties => node['acs']['config'])
  notifies :restart, 'service[acs]' if node['acs']['enable']
end

service 'acs' do
  action node['acs']['enable'] ? [:start, :enable] : [:stop, :disable]
  provider Chef::Provider::Service::Upstart
end
