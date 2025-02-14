define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Nations = void 0;
    exports.Nations = {
        "The Luminari": {
            "name": "The Luminari",
            "leader": "Queen Lyara",
            "flag_image": "../../assets/ui/flags/icons8-canada-100.png",
            "description": "A radiant realm guided by celestial wisdom, shining as a beacon of hope and enlightenment.",
            "cities": [
                "Auroralith",
                "Starlight Haven",
                "Radiant Spire",
                "Luminark",
                "Celestara",
                "Gleaming Cove",
                "Solstice Keep",
                "Astral Crown",
                "Beacon's Rest",
                "Illumindor"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "insulted": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Welcome, traveler. Do you seek the wisdom of the stars?"],
                "farewell": ["May your path shine ever brighter."],
                "victory": ["The light of the Luminari outshines all!"],
                "insulted": ["You dare to challenge the brilliance of the Luminari?"],
                "defeat": ["Even in defeat, the stars remain constant."]
            }
        },
        "USA": {
            "name": "USA",
            "leader": "President Trump",
            "flag_image": "../../assets/ui/flags/icons8-usa-100.png",
            "description": "A modern powerhouse, championing liberty and opportunity, ever striving for greatness on the world stage.",
            "cities": [
                "Washington",
                "New York",
                "Boston",
                "Philadelphia",
                "Atlanta",
                "Chicago",
                "San Francisco",
                "Los Angeles",
                "Houston",
                "Miami",
                "Seattle",
                "Dallas",
                "Denver",
                "Detroit",
                "Phoenix",
                "San Diego",
                "San Antonio",
                "Las Vegas",
                "St. Louis",
                "Baltimore",
                "Cleveland",
                "Pittsburgh",
                "Minneapolis",
                "Kansas City",
                "New Orleans",
                "Austin",
                "Nashville",
                "Charlotte",
                "Salt Lake City",
                "Portland",
                "Indianapolis",
                "Cincinnati",
                "Buffalo",
                "Oklahoma City",
                "Albuquerque",
                "Tucson",
                "Memphis",
                "Milwaukee",
                "Orlando",
                "Tampa",
                "Sacramento",
                "Columbus",
                "Raleigh",
                "Richmond",
                "San Jose",
                "Birmingham",
                "Providence",
                "Anchorage",
                "Honolulu"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Welcome to the land of liberty and opportunity."],
                "farewell": ["Keep striving for greatness."],
                "victory": ["Democracy has triumphed once again!"],
                "angry": [
                    "You underestimate the strength of our nation? Think again.",
                    "We will make America strong again. We will make America proud again. We will make America safe again. And we will make America great again!",
                    "Sometimes by losing a battle you find a new way to win the war."
                ],
                "defeat": ["Even in loss, our ideals endure."]
            }
        },
        "Soviet Union": {
            "name": "Soviet Union",
            "leader": "Premier Volkov",
            "flag_image": "../../assets/ui/flags/icons8-ussr-100.png",
            "description": "A formidable collective under the Red Banner, forging an industrial and ideological empire of workers.",
            "cities": [
                "Moscow",
                "Leningrad",
                "Stalingrad",
                "Novosibirsk",
                "Kiev",
                "Minsk",
                "Tashkent",
                "Riga",
                "Vilnius",
                "Murmansk"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/stalin.webp"],
                "angry": ["../../assets/leaders/stalin-angry.webp"]
            },
            "quotes": {
                "greeting": ["Comrade, let us discuss the future of the proletariat."],
                "farewell": ["The revolution continues.", "Do svidaniya."],
                "victory": ["The workers of the world have united in triumph!"],
                "angry": ["Foolish to challenge the might of the Union."],
                "defeat": ["The struggle persists, even in defeat."]
            }
        },
        "China": {
            "name": "China",
            "leader": "Chairman Wei",
            "flag_image": "../../assets/ui/flags/icons8-china-100.png",
            "description": "An enduring civilization blending ancient heritage with modern ambitions, led by the steady hand of Chairman Wei.",
            "cities": [
                "Beijing",
                "Shanghai",
                "Guangzhou",
                "Shenzhen",
                "Chengdu",
                "Xi'an",
                "Wuhan",
                "Hangzhou",
                "Nanjing",
                "Tianjin"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Greetings from the Middle Kingdom."],
                "farewell": ["May your endeavors bring prosperity."],
                "victory": ["China rises above all challenges!"],
                "angry": ["Your actions disrupt the harmony of our relations."],
                "defeat": ["The dragon endures, even when wounded."]
            }
        },
        "Rome": {
            "name": "Rome",
            "leader": "Emperor Augustus",
            "flag_image": "../../assets/ui/flags/icons8-italy-100.png",
            "description": "The Eternal City stands at the center of civilization, expanding its influence with legions and grand roads.",
            "cities": [
                "Rome",
                "Mediolanum",
                "Neapolis",
                "Syracusae",
                "Ravenna",
                "Carthago Nova",
                "Lugdunum",
                "Massilia",
                "Brundisium",
                "Capua"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Salve! Rome welcomes you with open arms."],
                "farewell": ["Fare thee well, friend of Rome."],
                "victory": ["All roads lead to our triumph!"],
                "angry": ["You dare defy the might of the Eternal City?"],
                "defeat": ["Even mighty Rome must bend to fate..."]
            }
        },
        "Egypt": {
            "name": "Egypt",
            "leader": "Pharaoh Cleopatra",
            "flag_image": "../../assets/ui/flags/icons8-egypt-100.png",
            "description": "A land of timeless marvels along the Nile, guided by the wisdom and allure of its legendary Pharaoh.",
            "cities": [
                "Memphis",
                "Thebes",
                "Alexandria",
                "Giza",
                "Heliopolis",
                "Avaris",
                "Pi-Ramesses",
                "Tanis",
                "Hermopolis",
                "Bubastis"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["We greet you under the ever-watchful eyes of the gods."],
                "farewell": ["The Nile's blessings go with you."],
                "victory": ["The gods favor our reign this day!"],
                "angry": ["Beware: you anger a power older than the sands."],
                "defeat": ["Even Pharaoh must bow before destiny..."]
            }
        },
        "Greece": {
            "name": "Greece",
            "leader": "King Alexander",
            "flag_image": "../../assets/ui/flags/icons8-greece-100.png",
            "description": "Birthplace of philosophy and strategy, unified under Alexander’s ambition to spread Hellenic culture across the world.",
            "cities": [
                "Athens",
                "Sparta",
                "Corinth",
                "Thebes",
                "Rhodes",
                "Ephesus",
                "Knossos",
                "Delphi",
                "Argos",
                "Pergamon"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Hail, traveler! Greece extends its wisdom to you."],
                "farewell": ["Farewell, friend. May Athena guide your path."],
                "victory": ["The glory of Hellas stands supreme!"],
                "angry": ["You provoke the wrath of the Olympians!"],
                "defeat": ["Our brilliance is dimmed, but not extinguished..."]
            }
        },
        "Britain": {
            "name": "Britain",
            "leader": "Queen Victoria",
            "flag_image": "../../assets/ui/flags/icons8-great-britain-100.png",
            "description": "A seafaring empire wielding industrial might and colonial ambitions, led by the steadfast Queen Victoria.",
            "cities": [
                "London",
                "Birmingham",
                "Manchester",
                "Liverpool",
                "Leeds",
                "Glasgow",
                "Edinburgh",
                "Cardiff",
                "Belfast",
                "Bristol"
            ],
            "leader_images": {
                "default": ["../../assets/leaders/default.png"],
                "angry": ["../../assets/leaders/default.png"]
            },
            "quotes": {
                "greeting": ["Welcome, from across the seas, to the British Isles."],
                "farewell": ["A fond farewell, until we next meet."],
                "victory": ["Rule Britannia! Our empire stands victorious!"],
                "angry": ["You dare challenge the Crown?"],
                "defeat": ["Even the greatest empire must weather storms..."]
            }
        }
    };
});
//# sourceMappingURL=Nations.js.map