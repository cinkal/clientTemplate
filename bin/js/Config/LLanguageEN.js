var LConfig;
(function (LConfig) {
    var LBYLanguageEN = /** @class */ (function () {
        function LBYLanguageEN() {
        }
        LBYLanguageEN.getId = function (id) {
            return this.configCache[id.toString()].id;
        };
        LBYLanguageEN.getText = function (id) {
            return this.configCache[id.toString()].text;
        };
        LBYLanguageEN.size = function () {
            var count = 0;
            for (var key in this.configCache) {
                if (this.configCache.hasOwnProperty(key)) {
                    count++;
                }
            }
            return count;
        };
        LBYLanguageEN.configCache = {
            "1": {
                id: 1,
                text: "Dominoes",
            },
            "2": {
                id: 2,
                text: "Score {0} to win",
            },
            "3": {
                id: 3,
                text: "Your turn",
            },
            "4": {
                id: 4,
                text: "Blocked",
            },
            "5": {
                id: 5,
                text: "Please choose a domino",
            },
            "6": {
                id: 6,
                text: "{0} is drawing",
            },
            "7": {
                id: 7,
                text: "The End",
            },
            "8": {
                id: 8,
                text: "{0} won this round.",
            },
            "9": {
                id: 9,
                text: "The game continues and a new round begins in {0} seconds.",
            },
            "10": {
                id: 10,
                text: "Game Over",
            },
            "11": {
                id: 11,
                text: "Score",
            },
            "12": {
                id: 12,
                text: "Score:",
            },
            "13": {
                id: 13,
                text: "Loading",
            },
            "14": {
                id: 14,
                text: "My Gold",
            },
            "15": {
                id: 15,
                text: "My Gem",
            },
            "16": {
                id: 16,
                text: "My Coins",
            },
            "17": {
                id: 17,
                text: "Max Players",
            },
            "18": {
                id: 18,
                text: "Bet",
            },
            "19": {
                id: 19,
                text: "Join game as a player",
            },
            "20": {
                id: 20,
                text: "Invite Players",
            },
            "21": {
                id: 21,
                text: "Notification",
            },
            "22": {
                id: 22,
                text: "You have ended the game halfway when winners have not yet all come out, you can only start game again at {0}.",
            },
            "23": {
                id: 23,
                text: "Purchase Gold",
            },
            "24": {
                id: 24,
                text: "Not enough Gold, would you like to buy some?",
            },
            "25": {
                id: 25,
                text: "Description",
            },
            "26": {
                id: 26,
                text: "1. To start the game, the player holding the highest double plays it on the board. \n\n 2. On your turn, play a domino that matches the number of dots on one of the open dominoes on the board. If you cannot play a domino, you must draw dominoes from the boneyard until you have a domino which will play or the boneyard is empty.\n\n 3. If you cannot play a domino and the boneyard is empty, you pass.\n\n 4. After you play a domino, count the number of dots on the two, three or four open ends of the board. If this total is a multiple of five, score that many points to you. \n\n 5. Win a round by running out of dominoes first or being blocked. The round winner scores point equal to the total remaining dots in the other players' hands.\n\n 6. The first player to score 150 points will win the game. \n\n 7. There is 5% service charge each game, paid by the winning player.",
            },
            "27": {
                id: 27,
                text: "{0} Gold",
            },
            "28": {
                id: 28,
                text: "Purchase Coins",
            },
            "29": {
                id: 29,
                text: "Not enough Coins, would you like to buy some?",
            },
            "30": {
                id: 30,
                text: "Purchase Gem",
            },
            "31": {
                id: 31,
                text: "{0} Gem",
            },
            "32": {
                id: 32,
                text: "Players",
            },
            "33": {
                id: 33,
                text: "Waiting for players to join",
            },
            "34": {
                id: 34,
                text: "You can start game when start button become yellow",
            },
            "35": {
                id: 35,
                text: "Start",
            },
            "36": {
                id: 36,
                text: "Sorry, player are not enough. Please wait.",
            },
            "37": {
                id: 37,
                text: "Join",
            },
            "38": {
                id: 38,
                text: "Sorry, game has started. Please join again for next game.",
            },
            "39": {
                id: 39,
                text: "Sorry, all positions are taken. Please try again when host starts a new game.",
            },
            "40": {
                id: 40,
                text: "Waiting for host to start game",
            },
            "41": {
                id: 41,
                text: "You joined game successfully",
            },
            "42": {
                id: 42,
                text: "Sorry, the game is over. Please try again when host starts a new game.",
            },
            "43": {
                id: 43,
                text: "Quit Game",
            },
            "44": {
                id: 44,
                text: "Winners have not yet come out, if you quit game halfway 3 times a day, you will be unable to start game again.",
            },
            "45": {
                id: 45,
                text: "The host has ended the game. You'll automatically exit the game after {0} seconds.",
            },
            "46": {
                id: 46,
                text: "Winners have not yet come out, bet won't be refunded if you quit game halfway.",
            },
            "47": {
                id: 47,
                text: "Player {0} left the game.",
            },
            "48": {
                id: 48,
                text: "Left",
            },
            "49": {
                id: 49,
                text: "Winners have not yet come out, are you sure to quit the room?",
            },
            "50": {
                id: 50,
                text: "Gold",
            },
            "51": {
                id: 51,
                text: "There is {0}% service charge each game, paid by the winning player.",
            },
            "52": {
                id: 52,
                text: "This match is invalid, and bet is refunded.",
            },
            "53": {
                id: 53,
                text: "Play Again",
            },
            "54": {
                id: 54,
                text: "Waiting host to start a new game",
            },
            "55": {
                id: 55,
                text: "Click one of your dominoes to make exchange with boneyard.",
            },
            "56": {
                id: 56,
                text: "Sorry, boneyard is empty. Make exchange unsuccessfully.",
            },
            "57": {
                id: 57,
                text: "Daily Prizes",
            },
            "58": {
                id: 58,
                text: "Your gold is less than {0}, and {1} gold has been given to you. Good luck.",
            },
            "59": {
                id: 59,
                text: "Are you sure to quit the room?",
            },
            "60": {
                id: 60,
                text: "You have ended the game",
            },
            "61": {
                id: 61,
                text: "Host has ended the game",
            },
            "62": {
                id: 62,
                text: "You are now an audience.",
            },
            "63": {
                id: 63,
                text: "The domino has been played. Please choose again.",
            },
        };
        return LBYLanguageEN;
    }());
    LConfig.LBYLanguageEN = LBYLanguageEN;
})(LConfig || (LConfig = {}));
//# sourceMappingURL=LLanguageEN.js.map