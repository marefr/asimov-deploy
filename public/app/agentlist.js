/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

define([
	"jquery",
	"underscore",
	"backbone",
	"marionette",
	"app"
],
function($, _, Backbone, Marionette, app) {

	var AgentItemView = Marionette.ItemView.extend({
		template: "agent-item-view",
		tagName: "tr"
	});

	var AgentListView = Marionette.CompositeView.extend({
		itemView: AgentItemView,
		itemViewContainer: "tbody",
		template: "agent-list-view"
	});

	var AgentCollection = Backbone.Collection.extend({
		url: "/agents/list",

		parse: function (agentList) {
			return _.map(agentList, function (agent) {
				var sortedGroups = agent.agentGroups.sort();
				var groupString = _.reduce(sortedGroups, function (memo, val) {
					if (memo) {
						return memo + ', ' + val;
					}

					return val;
				}, null);

				return {
					name: agent.name,
					groups: groupString,
					dead: agent.dead,
					version: agent.version,
					configVersion: agent.configVersion,
					loadBalancerState: agent.loadBalancerState
				};
			});
		}
	});

	var agentsList = new AgentCollection();

	app.vent.on("agentlist:show", function() {
		app.mainRegion.show(new AgentListView({collection: agentsList}));
		agentsList.fetch();

		app.router.showRoute("agents");
	});

	return {};

});