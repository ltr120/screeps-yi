const creepUtils = require('creepUtils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		creepUtils.tryAssignSource(creep, '5bbcaa9a9099fc012e631bf1');

		if (creep.ticksToLive <= 50 && (!creep.memory.building)) {
			creep.suicide();
			return;
		}

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            if (creep.room.name != Game.spawns['Spawn1'].room.name) {
				console.log(creep.name + '|' + creep.room.name);
				// Get back to room
				const exitDir = creep.room.findExitTo(spawnerRoomName);
				const exit = creep.pos.findClosestByRange(exitDir);
				creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
	        	let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            	if(targets.length) {
					targets = _.sortBy(targets, target => {
						let weight = 0;
						switch(target.structureType) {
							case STRUCTURE_EXTENSION:
								break;
							case STRUCTURE_ROAD:
								weight += 50;
								break;
							default:
								weight += 1000;
								break;
						}
						weight += creep.pos.getRangeTo(target);
						return weight;
					});
                	if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                	}
				} else if (!creepUtils.tryRepairWalls(creep)) {
					creepUtils.goToParkingLot(creep);
				}
			}
	    }
	    else {
			creepUtils.harvestFromAssignedSourceInSameRoom(creep);
	    }
	}
};

module.exports = roleBuilder;