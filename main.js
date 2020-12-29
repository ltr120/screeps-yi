const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRoadKeeper = require('role.roadkeeper');
const creepSpawnUtils = require('creepSpawnUtils');

module.exports.loop = function () {
    if (!Memory.sourceIds || !Memory.sources) {
        Memory.sources = {};
        Memory.sourceIds = [];
        let energySources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        for (let i in energySources) {
            Memory.sourceIds[i] = energySources[i].id;
            Memory.sources[Memory.sourceIds[i]] = [];
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    creepSpawnUtils.trySpawnEverything(Game);

    var tower = Game.getObjectById('5fe9e37e78f874113123eb25');
    if(tower) {
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => (structure.hits * 60) < structure.hitsMax
        // });
        // if(closestDamagedStructure) {
        //     tower.repair(closestDamagedStructure);
        // }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'roadkeeper':
                roleRoadKeeper.run(creep);
        }
    }
}