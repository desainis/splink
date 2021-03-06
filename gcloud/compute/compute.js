var utilsSlack = require('../../lib/utilsSlack');
var utils = require('../../lib/utils.js');

module.exports = {
    createVirtualMachine: function (secrets, projectId, vmName) {
        // [START gce_create_vm]
        const Compute = require('@google-cloud/compute');
        const compute = new Compute({
            projectId: projectId,
            keyFilename: secrets
        });
        const zone = compute.zone('us-central1-c');

        var promise = zone.createVM(vmName, {
            os: 'ubuntu'
        }).then(function (data) {
            console.log('Virtual machine created!');
        }).catch(function (error) {
            console.log(error);
        });

    },

    createNetwork: function(secrets, config, name) {

        const Compute = require('@google-cloud/compute');
        var projectId = 'eloquent-walker-177701';
        const compute = new Compute({
            projectId: projectId,
            keyFilename: process.env.GCP_SECRETS
        });
          
        compute.createNetwork(name, config).then(function(data) {
        var network = data[0];
        var operation = data[1];
        var apiResponse = data[2];

        console.log("Network Successfully Created!");

        });
    },

    listVMs: function (secrets) {
        const Compute = require('@google-cloud/compute');
        var projectId = 'eloquent-walker-177701';
        const compute = new Compute({
            projectId: projectId,
            keyFilename: process.env.GCP_SECRETS
        });

        var promise = compute.getVMs().then(function (data) {
                var vms = data[0];

                var arrayLength = vms.length;
                var attachments = [];
                for (var i = 0; i < arrayLength; i++) {
                    var vm = vms[i];

                    // Get all required fields
                    var vmName = vm.name;
                    var description = vm.description;
                    var vmStatus = vm.metadata.status;

                    // Zone
                    var zoneName = vm.zone.name;

                    // Network Interfaces
                    var networkInterfaces = vm.metadata.networkInterfaces;
                    var privateIP = networkInterfaces[0].networkIP;
                    var publicIP = networkInterfaces[0].accessConfigs[0].natIP;

                    attachments.push({
                        fallback: "Google Cloud Virtual Instances Summary",
                        color: "#2eb886",
                        title: "Google Cloud Virtual Instances",
                        text: "Summary of Resource " + utils.codifyString(vmName),
                        fields: [{
                                title: "VSI Name",
                                value: vmName,
                                short: true
                            },
                            {
                                title: "Description",
                                value: description,
                                short: true
                            },
                            {
                                title: "Status",
                                value: vmStatus,
                                short: true
                            },
                            {
                                title: "Zone",
                                value: zoneName,
                                short: true
                            },
                            {
                                title: "Private IP",
                                value: utils.codifyString(privateIP),
                                short: true
                            },
                            {
                                title: "Public IP",
                                value: utils.codifyString(publicIP),
                                short: true
                            }
                        ],
                        ts: new Date() / 1000
                    });

                }

                return attachments;
            })
            .catch(function (error) {
                console.log(error);
            });

        return promise;
    }
}