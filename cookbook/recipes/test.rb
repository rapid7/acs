#
# Cookbook Name:: acs
# Recipe:: test
#
# Copyright (C) 2017 Rapid7 LLC.
#
# Distributed under terms of the MIT License. All rights not explicitly granted
# in the MIT license are reserved. See the included LICENSE file for more details.
#

node.default['acs']['config']['vault'] = Mash.new(
  :host => '127.0.0.1',
  :port => 8200,
  :tls => false,
  :api => 'v1',
  :transit_key => 'your_acs_key'
)

include_recipe 'acs::default'

resources('service[acs]').action([:start, :enable])
