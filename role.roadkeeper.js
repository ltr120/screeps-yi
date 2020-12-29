const creepUtils = require('creepUtils');

let roleRoadkeeper = {

    /** @param {Creep} creep **/
    run: function(creep) {
		creepUtils.tryAssignSource(creep, '5bbcaa9a9099fc012e631bf1');

		if (creep.ticksToLive <= 50 && (!creep.memory.repairing)) {
			creep.suicide();
			return;
		}

	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
            if (creep.room.name != Game.spawns['Spawn1'].room.name) {
				console.log(creep.name + '|' + creep.room.name);
				// Get back to room
				const exitDir = creep.room.findExitTo(spawnerRoomName);
				const exit = creep.pos.findClosestByRange(exitDir);
				creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (!creepUtils.tryRepairWalls(creep)) {
                creepUtils.goToParkingLot(creep);
			}
	    }
	    else {
			creepUtils.harvestFromAssignedSourceInSameRoom(creep);
	    }
	}
};

module.exports = roleRoadkeeper;