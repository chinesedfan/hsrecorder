var CardsInfo = (function() {
	var _infoList = [
// 5xxxx: legendary
		{id: 50001, name: "Al'Akir the Windlord"},
		{id: 50002, name: 'Alexstrasza'},
		{id: 50003, name: 'Archmage Antonidas'},
		{id: 50004, name: 'Baron Geddon'},
		{id: 50005, name: 'Bloodmage Thalnos'},
		{id: 50006, name: 'Cairne Bloodhoof'},
		{id: 50007, name: 'Captain Greenskin'},
		{id: 50008, name: 'Cenarius'},
		{id: 50009, name: 'Deathwing'},
		{id: 50010, name: 'Edwin VanCleef'},
		{id: 50011, name: 'Elite Tauren Chieftain'},
		{id: 50012, name: 'Gelbin Mekkatorque'},
		{id: 50013, name: 'Grommash Hellscream'},
		{id: 50014, name: 'Gruul'},
		{id: 50015, name: 'Harrison Jones'},
		{id: 50016, name: 'Hogger'},
		{id: 50017, name: 'Illidan Stormrage'},
		{id: 50018, name: 'King Krush'},
		{id: 50019, name: 'King Mukla'},
		{id: 50020, name: 'Leeroy Jenkins'},
		{id: 50021, name: 'Lord Jaraxxus'},
		{id: 50022, name: 'Lorewalker Cho'},
		{id: 50023, name: 'Malygos'},
		{id: 50024, name: 'Millhouse Manastorm'},
		{id: 50025, name: 'Nat Pagle'},
		{id: 50026, name: 'Nozdormu'},
		{id: 50027, name: 'Old Murk-Eye'},
		{id: 50028, name: 'Onyxia'},
		{id: 50029, name: 'Prophet Velen'},
		{id: 50030, name: 'Ragnaros the Firelord'},
		{id: 50031, name: 'Sylvanas Windrunner'},
		{id: 50032, name: 'The Beast'},
		{id: 50033, name: 'The Black Knight'},
		{id: 50034, name: 'Tinkmaster Overspark'},
		{id: 50035, name: 'Tirion Fordring'},
		{id: 50036, name: 'Ysera'},
		// Gobins vs Gnomes
		{id: 50037, name: "Hemet Nesingwary"},
		{id: 50038, name: "Blingtron 3000"},
		{id: 50039, name: "Troggzor the Earthinator"},
		{id: 50040, name: "Gazlowe"},
		{id: 50041, name: "Mekgineer Thermaplugg"},
		{id: 50042, name: "Toshley"},
		{id: 50043, name: "Sneed's Old Shredder"},
		{id: 50044, name: "Foe Reaper 4000"},
		{id: 50045, name: "Mogor the Ogre"},
		{id: 50046, name: "Mimiron's Head"},
		{id: 50047, name: "Dr. Boom"},
		{id: 50048, name: "Bolvar Fordragon"},
		{id: 50049, name: "Iron Juggernaut"},
		{id: 50050, name: "Gahz'rilla"},
		{id: 50051, name: "Neptulon"},
		{id: 50052, name: "Malorne"},
		{id: 50053, name: "Trade Prince Gallywix"},
		{id: 50054, name: "Mal'Ganis"},
		{id: 50055, name: "Vol'jin"},
		{id: 50056, name: "Flame Leviathan"},
// 4xxxx: epic
		{id: 40001, name: 'Ancient of Lore'},
		{id: 40002, name: 'Ancient of War'},
		{id: 40003, name: 'Avenging Wrath'},
		{id: 40004, name: 'Bane of Doom'},
		{id: 40005, name: 'Bestial Wrath'},
		{id: 40006, name: 'Big Game Hunter'},
		{id: 40007, name: 'Blood Knight'},
		{id: 40008, name: 'Brawl'},
		{id: 40009, name: 'Cabal Shadow Priest'},
		{id: 40010, name: "Captain's Parrot"},
		{id: 40011, name: 'Doomhammer'},
		{id: 40012, name: 'Doomsayer'},
		{id: 40013, name: 'Earth Elemental'},
		{id: 40014, name: 'Faceless Manipulator'},
		{id: 40015, name: 'Far Sight'},
		{id: 40016, name: 'Force of Nature'},
		{id: 40017, name: "Gladiator's Longbow"},
		{id: 40018, name: 'Gorehowl'},
		{id: 40019, name: 'Hungry Crab'},
		{id: 40020, name: 'Ice Block'},
		{id: 40021, name: 'Kidnapper'},
		{id: 40022, name: 'Lay on Hands'},
		{id: 40023, name: 'Mindgames'},
		{id: 40024, name: 'Molten Giant'},
		{id: 40025, name: 'Mountain Giant'},
		{id: 40026, name: 'Murloc Warleader'},
		{id: 40027, name: 'Patient Assassin'},
		{id: 40028, name: 'Pit Lord'},
		{id: 40029, name: 'Preparation'},
		{id: 40030, name: 'Pyroblast'},
		{id: 40031, name: 'Sea Giant'},
		{id: 40032, name: 'Shadowform'},
		{id: 40033, name: 'Shield Slam'},
		{id: 40034, name: 'Snake Trap'},
		{id: 40035, name: 'Southsea Captain'},
		{id: 40036, name: 'Spellbender'},
		{id: 40037, name: 'Sword of Justice'},
		{id: 40038, name: 'Twisting Nether'},
		// Gobins vs Gnomes
		{id: 40039, name: "Wee Spellstopper"},
		{id: 40040, name: "Clockwork Giant"},
		{id: 40041, name: "Mini-Mage"},
		{id: 40042, name: "Recombobulator"},
		{id: 40043, name: "Enhance-o Mechano"},
		{id: 40044, name: "Junkbot"},
		{id: 40045, name: "Piloted Sky Golem"},
		{id: 40046, name: "Hobgoblin"},
		{id: 40047, name: "Steamwheedle Sniper"},
		{id: 40048, name: "Anima Golem"},
		{id: 40049, name: "Quartermaster"},
		{id: 40050, name: "Coghammer"},
		{id: 40051, name: "Crush"},
		{id: 40052, name: "Bouncing Blade"},
		{id: 40053, name: "Sabotage"},
		{id: 40054, name: "Dark Wispers"},
		{id: 40055, name: "Siltfin Spiritwalker"},
		{id: 40056, name: "Tree of Life"},
		{id: 40057, name: "Ancestor's Call"},
		{id: 40058, name: "Feign Death"},
		{id: 40059, name: "Cogmaster's Wrench"},
		{id: 40060, name: "Demonheart"},
		{id: 40061, name: "Fel Reaver"},
		{id: 40062, name: "Shadowbomber"},
		{id: 40063, name: "Lightbomb"},
		{id: 40064, name: "Echo of Medivh"},
// 3xxxx: rare
		{id: 30001, name: 'Abomination'},
		{id: 30002, name: 'Alarm-o-Bot'},
		{id: 30003, name: 'Aldor Peacekeeper'},
		{id: 30004, name: 'Ancestral Spirit'},
		{id: 30005, name: 'Ancient Mage'},
		{id: 30006, name: 'Ancient Watcher'},
		{id: 30007, name: 'Angry Chicken'},
		{id: 30008, name: 'Arcane Golem'},
		{id: 30009, name: 'Argent Commander'},
		{id: 30010, name: 'Armorsmith'},
		{id: 30011, name: 'Auchenai Soulpriest'},
		{id: 30012, name: 'Azure Drake'},
		{id: 30013, name: 'Bite'},
		{id: 30014, name: 'Blade Flurry'},
		{id: 30015, name: 'Blessed Champion'},
		{id: 30016, name: 'Blizzard'},
		{id: 30017, name: 'Bloodsail Corsair'},
		{id: 30018, name: 'Coldlight Oracle'},
		{id: 30019, name: 'Coldlight Seer'},
		{id: 30020, name: 'Commanding Shout'},
		{id: 30021, name: 'Counterspell'},
		{id: 30022, name: 'Crazed Alchemist'},
		{id: 30023, name: 'Defender of Argus'},
		{id: 30024, name: 'Demolisher'},
		{id: 30025, name: 'Divine Favor'},
		{id: 30026, name: 'Doomguard'},
		{id: 30027, name: 'Eaglehorn Bow'},
		{id: 30028, name: 'Emperor Cobra'},
		{id: 30029, name: 'Equality'},
		{id: 30030, name: 'Ethereal Arcanist'},
		{id: 30031, name: 'Explosive Shot'},
		{id: 30032, name: 'Felguard'},
		{id: 30033, name: 'Feral Spirit'},
		{id: 30034, name: 'Flare'},
		{id: 30035, name: 'Frothing Berserker'},
		{id: 30036, name: 'Gadgetzan Auctioneer'},
		{id: 30037, name: 'Headcrack'},
		{id: 30038, name: 'Holy Fire'},
		{id: 30039, name: 'Holy Wrath'},
		{id: 30040, name: 'Imp Master'},
		{id: 30041, name: 'Injured Blademaster'},
		{id: 30042, name: 'Keeper of the Grove'},
		{id: 30043, name: 'Kirin Tor Mage'},
		{id: 30044, name: 'Knife Juggler'},
		{id: 30045, name: 'Lava Burst'},
		{id: 30046, name: 'Lightning Storm'},
		{id: 30047, name: 'Lightwarden'},
		{id: 30048, name: 'Lightwell'},
		{id: 30049, name: 'Mana Addict'},
		{id: 30050, name: 'Mana Tide Totem'},
		{id: 30051, name: 'Mana Wraith'},
		{id: 30052, name: 'Mass Dispel'},
		{id: 30053, name: 'Master Swordsmith'},
		{id: 30054, name: 'Master of Disguise'},
		{id: 30055, name: 'Mind Control Tech'},
		{id: 30056, name: 'Misdirection'},
		{id: 30057, name: 'Mortal Strike'},
		{id: 30058, name: 'Murloc Tidecaller'},
		{id: 30059, name: 'Nourish'},
		{id: 30060, name: "Perdition's Blade"},
		{id: 30061, name: 'Pint-Sized Summoner'},
		{id: 30062, name: 'Questing Adventurer'},
		{id: 30063, name: 'Ravenholdt Assassin'},
		{id: 30064, name: 'SI:7 Agent'},
		{id: 30065, name: 'Savagery'},
		{id: 30066, name: 'Savannah Highmane'},
		{id: 30067, name: 'Secretkeeper'},
		{id: 30068, name: 'Shadow Madness'},
		{id: 30069, name: 'Shadowflame'},
		{id: 30070, name: 'Siphon Soul'},
		{id: 30071, name: 'Stampeding Kodo'},
		{id: 30072, name: 'Starfall'},
		{id: 30073, name: 'Sunfury Protector'},
		{id: 30074, name: 'Sunwalker'},
		{id: 30075, name: 'Twilight Drake'},
		{id: 30076, name: 'Upgrade!'},
		{id: 30077, name: 'Vaporize'},
		{id: 30078, name: 'Violet Teacher'},
		{id: 30079, name: 'Void Terror'},
		{id: 30080, name: 'Wild Pyromancer'},
		{id: 30081, name: 'Young Priestess'},
		// Gobins vs Gnomes
		{id: 30082, name: "Soot Spewer"},
		{id: 30083, name: "Scarlet Purifier"},
		{id: 30084, name: "Bomb Lobber"},
		{id: 30085, name: "Lil' Exorcist"},
		{id: 30086, name: "Goblin Sapper"},
		{id: 30087, name: "Jeeves"},
		{id: 30088, name: "Target Dummy"},
		{id: 30089, name: "Gnomish Experimenter"},
		{id: 30090, name: "Arcane Nullifier X-21"},
		{id: 30091, name: "Madder Bomber"},
		{id: 30092, name: "Illuminator"},
		{id: 30093, name: "Ogre Ninja"},
		{id: 30094, name: "Siege Engine"},
		{id: 30095, name: "Upgraded Repair Bot"},
		{id: 30096, name: "Kezan Mystic"},
		{id: 30097, name: "Shadowboxer"},
		{id: 30098, name: "Dunemaul Shaman"},
		{id: 30099, name: "Cobalt Guardian"},
		{id: 30100, name: "Muster for Battle"},
		{id: 30101, name: "Screwjank Clunker"},
		{id: 30102, name: "Shieldmaiden"},
		{id: 30103, name: "Metaltooth Leaper"},
		{id: 30104, name: "King of Beasts"},
		{id: 30105, name: "Imp-losion"},
		{id: 30106, name: "Vitality Totem"},
		{id: 30107, name: "Powermace"},
		{id: 30108, name: "Mech-Bear-Cat"},
		{id: 30109, name: "Grove Tender"},
		{id: 30110, name: "Recycle"},
		{id: 30111, name: "Iron Sensei"},
		{id: 30112, name: "One-eyed Cheat"},
		{id: 30113, name: "Fel Cannon"},
		{id: 30114, name: "Mistress of Pain"},
		{id: 30115, name: "Call Pet"},
		{id: 30116, name: "Light of the Naaru"},
		{id: 30117, name: "Goblin Blastmage"},
		{id: 30118, name: "Unstable Portal"},
// 2xxxx: common
		{id: 20001, name: 'Abusive Sergeant'},
		{id: 20002, name: 'Acidic Swamp Ooze'},
		{id: 20003, name: 'Acolyte of Pain'},
		{id: 20004, name: 'Amani Berserker'},
		{id: 20005, name: 'Ancient Brewmaster'},
		{id: 20006, name: 'Animal Companion'},
		{id: 20007, name: 'Arathi Weaponsmith'},
		{id: 20008, name: 'Arcanite Reaper'},
		{id: 20009, name: 'Archmage'},
		{id: 20010, name: 'Argent Protector'},
		{id: 20011, name: 'Argent Squire'},
		{id: 20012, name: "Assassin's Blade"},
		{id: 20013, name: 'Battle Rage'},
		{id: 20014, name: 'Betrayal'},
		{id: 20015, name: 'Blessing of Kings'},
		{id: 20016, name: 'Blessing of Wisdom'},
		{id: 20017, name: 'Blood Imp'},
		{id: 20018, name: 'Bloodlust'},
		{id: 20019, name: 'Bloodsail Raider'},
		{id: 20020, name: 'Bluegill Warrior'},
		{id: 20021, name: 'Booty Bay Bodyguard'},
		{id: 20022, name: 'Chillwind Yeti'},
		{id: 20023, name: 'Circle of Healing'},
		{id: 20024, name: 'Cleave'},
		{id: 20025, name: 'Cold Blood'},
		{id: 20026, name: 'Conceal'},
		{id: 20027, name: 'Cone of Cold'},
		{id: 20028, name: 'Consecration'},
		{id: 20029, name: 'Core Hound'},
		{id: 20030, name: 'Corruption'},
		{id: 20031, name: 'Cruel Taskmaster'},
		{id: 20032, name: 'Cult Master'},
		{id: 20033, name: 'Dalaran Mage'},
		{id: 20034, name: 'Dark Iron Dwarf'},
		{id: 20035, name: 'Darkscale Healer'},
		{id: 20036, name: 'Deadly Shot'},
		{id: 20037, name: 'Defias Ringleader'},
		{id: 20038, name: 'Demonfire'},
		{id: 20039, name: 'Dire Wolf Alpha'},
		{id: 20040, name: 'Divine Spirit'},
		{id: 20041, name: 'Dragonling Mechanic'},
		{id: 20042, name: 'Dread Corsair'},
		{id: 20043, name: 'Dread Infernal'},
		{id: 20044, name: 'Druid of the Claw'},
		{id: 20045, name: 'Dust Devil'},
		{id: 20046, name: 'Earth Shock'},
		{id: 20047, name: 'Earthen Ring Farseer'},
		{id: 20048, name: 'Elven Archer'},
		{id: 20049, name: 'Eviscerate'},
		{id: 20050, name: 'Explosive Trap'},
		{id: 20051, name: 'Eye for an Eye'},
		{id: 20052, name: 'Faerie Dragon'},
		{id: 20053, name: 'Fan of Knives'},
		{id: 20054, name: 'Fen Creeper'},
		{id: 20055, name: 'Fire Elemental'},
		{id: 20056, name: 'Flame Imp'},
		{id: 20057, name: 'Flamestrike'},
		{id: 20058, name: 'Flametongue Totem'},
		{id: 20059, name: 'Flesheating Ghoul'},
		{id: 20060, name: 'Forked Lightning'},
		{id: 20061, name: 'Freezing Trap'},
		{id: 20062, name: 'Frost Elemental'},
		{id: 20063, name: 'Frost Nova'},
		{id: 20064, name: 'Frostbolt'},
		{id: 20065, name: 'Frostwolf Grunt'},
		{id: 20066, name: 'Frostwolf Warlord'},
		{id: 20067, name: 'Gnomish Inventor'},
		{id: 20068, name: 'Goldshire Footman'},
		{id: 20069, name: 'Grimscale Oracle'},
		{id: 20070, name: 'Guardian of Kings'},
		{id: 20071, name: 'Gurubashi Berserker'},
		{id: 20072, name: 'Harvest Golem'},
		{id: 20073, name: 'Holy Nova'},
		{id: 20074, name: 'Humility'},
		{id: 20075, name: "Hunter's Mark"},
		{id: 20076, name: 'Ice Barrier'},
		{id: 20077, name: 'Ice Lance'},
		{id: 20078, name: 'Inner Fire'},
		{id: 20079, name: 'Inner Rage'},
		{id: 20080, name: 'Ironbark Protector'},
		{id: 20081, name: 'Ironbeak Owl'},
		{id: 20082, name: 'Ironforge Rifleman'},
		{id: 20083, name: 'Ironfur Grizzly'},
		{id: 20084, name: 'Jungle Panther'},
		{id: 20085, name: 'Kill Command'},
		{id: 20086, name: 'Kobold Geomancer'},
		{id: 20087, name: "Kor'kron Elite"},
		{id: 20088, name: 'Leper Gnome'},
		{id: 20089, name: 'Lightning Bolt'},
		{id: 20090, name: 'Lightspawn'},
		{id: 20091, name: 'Loot Hoarder'},
		{id: 20092, name: 'Lord of the Arena'},
		{id: 20093, name: 'Mad Bomber'},
		{id: 20094, name: 'Mana Wyrm'},
		{id: 20095, name: 'Mark of Nature'},
		{id: 20096, name: 'Mind Control'},
		{id: 20097, name: 'Mind Vision'},
		{id: 20098, name: 'Mirror Entity'},
		{id: 20099, name: 'Mirror Image'},
		{id: 20100, name: "Mogu'shan Warden"},
		{id: 20101, name: 'Moonfire'},
		{id: 20102, name: 'Mortal Coil'},
		{id: 20103, name: 'Murloc Tidehunter'},
		{id: 20104, name: 'Naturalize'},
		{id: 20105, name: 'Noble Sacrifice'},
		{id: 20106, name: 'Ogre Magi'},
		{id: 20107, name: 'Power Overwhelming'},
		{id: 20108, name: 'Power of the Wild'},
		{id: 20109, name: 'Priestess of Elune'},
		{id: 20110, name: 'Raging Worgen'},
		{id: 20111, name: 'Rampage'},
		{id: 20112, name: 'Razorfen Hunter'},
		{id: 20113, name: 'Redemption'},
		{id: 20114, name: 'Repentance'},
		{id: 20115, name: 'Sacrificial Pact'},
		{id: 20116, name: 'Savage Roar'},
		{id: 20117, name: 'Scarlet Crusader'},
		{id: 20118, name: 'Scavenging Hyena'},
		{id: 20119, name: 'Sense Demons'},
		{id: 20120, name: 'Shadow Word: Death'},
		{id: 20121, name: 'Shadowstep'},
		{id: 20122, name: 'Shattered Sun Cleric'},
		{id: 20123, name: 'Shield Block'},
		{id: 20124, name: 'Shieldbearer'},
		{id: 20125, name: 'Shiv'},
		{id: 20126, name: 'Silence'},
		{id: 20127, name: 'Silver Hand Knight'},
		{id: 20128, name: 'Silverback Patriarch'},
		{id: 20129, name: 'Silvermoon Guardian'},
		{id: 20130, name: 'Slam'},
		{id: 20131, name: 'Snipe'},
		{id: 20132, name: "Sorcerer's Apprentice"},
		{id: 20133, name: 'Soul of the Forest'},
		{id: 20134, name: 'Soulfire'},
		{id: 20135, name: 'Southsea Deckhand'},
		{id: 20136, name: 'Spellbreaker'},
		{id: 20137, name: 'Spiteful Smith'},
		{id: 20138, name: 'Sprint'},
		{id: 20139, name: 'Starfire'},
		{id: 20140, name: 'Starving Buzzard'},
		{id: 20141, name: 'Stormforged Axe'},
		{id: 20142, name: 'Stormpike Commando'},
		{id: 20143, name: 'Stormwind Champion'},
		{id: 20144, name: 'Stormwind Knight'},
		{id: 20145, name: 'Stranglethorn Tiger'},
		{id: 20146, name: 'Summoning Portal'},
		{id: 20147, name: 'Swipe'},
		{id: 20148, name: 'Tauren Warrior'},
		{id: 20149, name: 'Temple Enforcer'},
		{id: 20150, name: 'Thoughtsteal'},
		{id: 20151, name: 'Thrallmar Farseer'},
		{id: 20152, name: 'Totemic Might'},
		{id: 20153, name: 'Truesilver Champion'},
		{id: 20154, name: 'Tundra Rhino'},
		{id: 20155, name: 'Unbound Elemental'},
		{id: 20156, name: 'Unleash the Hounds'},
		{id: 20157, name: 'Vanish'},
		{id: 20158, name: 'Venture Co. Mercenary'},
		{id: 20159, name: 'War Golem'},
		{id: 20160, name: 'Water Elemental'},
		{id: 20161, name: 'Whirlwind'},
		{id: 20162, name: 'Windfury Harpy'},
		{id: 20163, name: 'Windspeaker'},
		{id: 20164, name: 'Wisp'},
		{id: 20165, name: 'Worgen Infiltrator'},
		{id: 20166, name: 'Wrath'},
		{id: 20167, name: 'Young Dragonhawk'},
		{id: 20168, name: 'Youthful Brewmaster'},
		// Gobins vs Gnomes
		{id: 20169, name: "Micro Machine"},
		{id: 20170, name: "Tinkertown Technician"},
		{id: 20171, name: "Floating Watcher"},
		{id: 20172, name: "Gnomeregan Infantry"},
		{id: 20173, name: "Piloted Shredder"},
		{id: 20174, name: "Annoy-o-Tron"},
		{id: 20175, name: "Flying Machine"},
		{id: 20176, name: "Clockwork Gnome"},
		{id: 20177, name: "Gilblin Stalker"},
		{id: 20178, name: "Druid of the Fang"},
		{id: 20179, name: "Force-Tank MAX"},
		{id: 20180, name: "Mechanical Yeti"},
		{id: 20181, name: "Explosive Sheep"},
		{id: 20182, name: "Ship's Cannon"},
		{id: 20183, name: "Cobra Shot"},
		{id: 20184, name: "Lost Tallstrider"},
		{id: 20185, name: "Salty Dog"},
		{id: 20186, name: "Antique Healbot"},
		{id: 20187, name: "Burly Rockjaw Trogg"},
		{id: 20188, name: "Stonesplinter Trogg"},
		{id: 20189, name: "Ogre Brute"},
		{id: 20190, name: "Puddlestomper"},
		{id: 20191, name: "Shielded Minibot"},
		{id: 20192, name: "Seal of Light"},
		{id: 20193, name: "Ogre Warmaul"},
		{id: 20194, name: "Warbot"},
		{id: 20195, name: "Spider Tank"},
		{id: 20196, name: "Glaivezooka"},
		{id: 20197, name: "Crackle"},
		{id: 20198, name: "Whirling Zap-o-matic"},
		{id: 20199, name: "Anodized Robo Cub"},
		{id: 20200, name: "Goblin Auto-Barber"},
		{id: 20201, name: "Tinker's Sharpsword Oil"},
		{id: 20202, name: "Darkbomb"},
		{id: 20203, name: "Cogmaster"},
		{id: 20204, name: "Shrinkmeister"},
		{id: 20205, name: "Velen's Chosen"},
		{id: 20206, name: "Mechwarper"},
		{id: 20207, name: "Snowchugger"},
		{id: 20208, name: "Flamecannon"}
	];
	var _prefixMap = {};

	var _qualityList = [
		{name: "Legendary", color: "orange", dust: 400, gdust: 1600},
		{name: "Epic", color: "purple", dust: 100, gdust: 400},
		{name: "Rare", color: "blue", dust: 20, gdust: 100},
		{name: "Common", color: "black", dust: 5, gdust: 50},
	];
	var _qualityNames = _qualityList.map(function(q) {
		return q.name;
	});

	var _classMap = {
		Druid: 0, Hunter: 1, Mage: 2,
		Paladin: 3, Priest: 4, Rogue: 5,
		Shaman: 6, Warlock: 7, Warrior: 8,
	};
	var _classNames = [];

	function _init() {
		// only classify by prefixes that are shorter than three
		_infoList.map(function(row) {
			var name = row.name.toLowerCase();
			for (var i = 0; i < 3; i++) {
				var key = name.substring(0, i+1);
				if (!(key in _prefixMap)) _prefixMap[key] = [];
				_prefixMap[key].push(row);
			}
		});
		// generate the name list of all 9 classes
		for (var key in _classMap) {
			_classNames.push(key);
		}
		return this;
	}

	return {
		// [string]
		classNames: _classNames,
		// {string, int}
		classMap: _classMap,
		// {string: string}
		prefixMap: _prefixMap,
		// [object]
		qualityList: _qualityList,
		// [string]
		qualityNames: _qualityNames,

		init: _init,
	};
})().init();