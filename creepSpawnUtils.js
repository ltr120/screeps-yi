const minHarvesterCount = 5;
const minBuilderCount = 4;
const minUpgraderCount = 4;
const minRoadkeeperCount = 1;

const harvesterBigParts = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const builderBigParts = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const upgraderBigParts = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const roadKeeperBigParts = [WORK, CARRY, MOVE, MOVE];

const defaultBigParts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];

let creepSpawnUtils = {

    trySpawnEverything: function(Game) {
        this.trySpawnCreep(Game, "roadkeeper", minRoadkeeperCount, roadKeeperBigParts, false);
        this.trySpawnCreep(Game, "upgrader", minUpgraderCount, upgraderBigParts, false);
        this.trySpawnCreep(Game, "builder", minBuilderCount, builderBigParts, false);
        this.trySpawnCreep(Game, "harvester", minHarvesterCount, harvesterBigParts, true);
        this.reportCreepCount(Game);
    },

    reportCreepCount: function(Game) {
        let creeps = _.filter(Game.creeps, (creep) => true);
        let countMap = {};
        creeps.forEach(creep => {
            if (countMap[creep.memory.role] == undefined) {
                countMap[creep.memory.role] = 0;
            }
            ++countMap[creep.memory.role];
        });
        console.log(JSON.stringify(countMap));
    },

    trySpawnCreep: function(Game, role, minCount, bigParts, shouldSpawnSmall) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if ((!creeps.length) || creeps.length < minCount) {
            let newName;
            let parts;
            if (bigParts) {
                parts = bigParts;
            } else {
                parts = defaultBigParts;
            }
            if (Game.spawns['Spawn1'].room.energyAvailable >= this.countSpawningCost(parts)) {
                console.log('SpawningCost = ' + this.countSpawningCost(parts));
                console.log('Available Energy = ' + Game.spawns['Spawn1'].room.energyAvailable);
                newName = role + 'Big' + Game.time;
            } else {
                if (!shouldSpawnSmall) {
                    return;
                }
                newName = role + Game.time;
                parts = [WORK, CARRY, MOVE];
            }
            console.log('Spawning new ' + role + ': ' + newName);
            Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: role}});
        }
    },

    countSpawningCost: function(parts) {
        let cost = 0;
        for (let part in parts) {
            switch(parts[part]) {
                case WORK:
                    cost += 100;
                    break;
                case CARRY:
                    cost += 50;
                    break;
                case MOVE:
                    cost += 50;
                    break;
                case ATTACK:
                    cost += 80;
                    break;
                case RANGED_ATTACK:
                    cost += 150;
                    break;
                case HEAL:
                    cost += 250;
                    break;
                case CLAIM:
                    cost += 600;
                    break;
                case TOUGH:
                    cost += 10;
                    break;
            }
        }
        return cost;
    },
};

module.exports = creepSpawnUtils;