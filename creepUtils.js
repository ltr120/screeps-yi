let creepUtils = {
    tryAssignSource: function(creep, sourceId) {
        if (!creep.memory.harvestFromSourceId) {
            if (!sourceId) {
                sourceId = Memory.sourceIds[Math.floor(Math.random() * Memory.sourceIds.length)];
            }
			Memory.sources[sourceId].push(creep.id);
			creep.memory.harvestFromSourceId = sourceId;
		}
    },

    goToParkingLot: function(creep) {
        let parkingLot = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        if (creep.pos.getRangeTo(parkingLot[0]) > 2) {
            creep.say('🅿️');
            creep.moveTo(parkingLot[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    tryRepairWalls: function(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object){
                if(
                    ((object.structureType === STRUCTURE_ROAD) && 
                    (object.hits <= object.hitsMax * 4 / 5)) ||
                    ((object.structureType === STRUCTURE_WALL) &&
                    (object.hits <= object.hitsMax / 60))
                ) {
                    return true;
                }
                return false;
            } 
        });
        if (targets.length) {
            targets = _.sortBy(targets, target => creep.pos.getRangeTo(target));
            creep.say('⛑︎');
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#09ff00'}});
            }
            return true;
        } else {
            return false;
        }
    },

    harvestFromAssignedSourceInSameRoom: function(creep) {
        const source = Game.getObjectById(creep.memory.harvestFromSourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },
}

module.exports = creepUtils;