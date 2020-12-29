const creepUtils = require('creepUtils');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.ticksToLive <= 50 && (!creep.memory.upgrading)) {
            creep.suicide();
            return;
        }
        creepUtils.tryAssignSource(creep, '5bbcaa9a9099fc012e631bef');
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            creepUtils.harvestFromAssignedSourceInSameRoom(creep);
        }
	}
};

module.exports = roleUpgrader;