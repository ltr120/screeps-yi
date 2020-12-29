const creepUtils = require('creepUtils');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creepUtils.tryAssignSource(creep, '5bbcaa9a9099fc012e631bf1');

        if(creep.memory.charging && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.charging = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.charging && creep.store.getFreeCapacity() == 0) {
	        creep.memory.charging = true;
	        creep.say('❇️ charging');
        }
        
	    if(creep.memory.charging) {
            const source = Game.getObjectById(creep.memory.harvestFromSourceId);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                targets = _.sortBy(targets, target => {
                    let weight = 0;
                    switch(target.structureType) {
                        case STRUCTURE_EXTENSION:
                            break;
                        case STRUCTURE_SPAWN:
                            weight += 100;
                            break;
                        case STRUCTURE_TOWER:
                            weight += 50;
                            break;
                        default:
                            weight += 200;
                            break;
                    }
                    return weight;
                })
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (!creepUtils.tryRepairWalls(creep)) {
                creepUtils.goToParkingLot(creep);
			}
        } else {
            creepUtils.harvestFromAssignedSourceInSameRoom(creep);
        }
	}
};

module.exports = roleHarvester;