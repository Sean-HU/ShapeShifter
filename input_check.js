const fs = require('fs')
// state functioninition inherited from assignment 1
class State {
    //var name;
    //var isFinal;

    constructor(name) {
        this.name = name; // the name of this State.
        this.isfinal = false; // Is this an "accept" State?
        this.arrows = {};  // character: [state names]
        // the keys in the 'arrows' dictionary will be the characters for the state
        // transitions. For an empty (epsilon) transition, the empty string ('') will
        // be used. All values will be a list of state names (even if there is only
        // one destination state for a character)
    }
}

/*
function __str__(this):
arrows = '\n'.join(["{ch}->({states})".format(ch=ch, states=','.join(states))
    for ch, states in this.arrows.items()])
return "State {name}{final}. Transitions: \n{arrows}".format(
    name=this.name, final=(" (Final)" if this.isfinal else ""),
arrows=arrows)
*/

// machine functioninition inherited from assignment 1
class Machine {
    constructor(start, alphabet, states) {
        this.start = start;  // a list of the names of start states
        this.alphabet = alphabet;  // this is a list of valid input characters
        this.states = states;  // a dictionary of name: State
        this.current = {}; // a list responsible for holding its current states
    }
}

// modifies given machine based on passed character
// Accepts: machine's current states, single user entered character
// Returns: updated machine based on character, machine status
//
// NOTE: machine status can be the following:
//       > NOT ACCEPT STATE | VALID INPUT
//       > ACCEPT STATE FOUND | VALID INPUT
//       > NOT ACCEPT STATE | INVALID INPUT

function execute_input(m, character) {
    var valid_flag = false;  // assume invalid until path is taken
    if (m.current.length === 0) {  // if the dfa is just starting
        m.current = (m.start).slice();
    }
    console.log("start:", m.current);
    m.current = check_epsilons(m);
    var new_states = [];
    for (var state in new_states) {
        if (!(state in m.current)) {
            m.current.push(state);
        }
    }
    for (var state in m.current) {
        if (character in m.states[state].arrows) {
            valid_flag = true;
            for (var new_state in m.states[state].arrows[character]) {
                if (!(new_state in new_states)) {
                    new_states.push(new_state);
                }
            }
        }
        else {
            continue;
        }
    }
    m.current = new_states.slice();
    m.current = check_epsilons(m);
    console.log((character + ":"), m.current);
    for (state in m.current) {
        if (m.states[state].isfinal) {
            return (m.current, true, valid_flag);
        }
    }
    console.log("current:", m.current);
    return [m.current, false, valid_flag];  // accept not reached, check for valid input
}


// manages any instance of epsilon
// Accepts: current machine
// Returns: updated list of states based on epsilon transitions
function check_epsilons(m) {
    var epsilon_loop;
    var new_states = [];
    for (state in m.current) {
        new_states.push(state);
    }
    for (state in m.current) {
        epsilon_loop = false;
        if ('' in m.states[state].arrows) {
            while (true) {
                epsilon_loop = true;
                for (var epsilon_node in m.states[state].arrows['']) {
                    if (!(epsilon_node in new_states)) {
                        new_states.push(epsilon_node);
                        epsilon_loop = false;
                    }
                }
                if (epsilon_loop === true) {
                    break;
                }
            }
        }
    }
    return new_states;
}


// generates machines based on the passed files
// Accepts: array of file names
// Returns: list of machines based on file contents
function load_machines(file_names) {
    var machines = [];
    for (file_name in file_names){
        var load_manager = new File(file_names,file_name)
        load_manager.open("r");
        load_manager.re
        states = {}
        starts = []
        finals = []
        alphabet = []
        load_manager.read(1)  // removes 'Q' padding
        while (load_manager.read(1) != '\n') // checks for newline
        {  
            load_manager.read(1)  // skip over formatting space
            state = load_manager.read(2) // read a state
            states[state] = State(state)
        }
        load_manager.read(2)  // removes 'E:' padding
        while (load_manager.read(1) != '\n')
        {  // checks for newline
            alphabet.push(load_manager.read(1))  // read a character
        }
        load_manager.read(1)  // removes 's' padding
        while (load_manager.read(1) != '\n')
        {   // checks for newline
            load_manager.read(1)  // skip over formatting space
            starts.push(load_manager.read(2))  // read a state
        }
        load_manager.read(1)  // removes 'F' padding
        while (load_manager.read(1) != '\n')
        {  // checks for newline
            load_manager.read(1)  // skip over formatting space
            states[load_manager.read(2)].isfinal = true  // update "final" status
        }


        load_manager.read(2)  // removes 'd:' padding
        while (load_manager.read(1) != '~')
        { // while not end of file
            source = load_manager.read(2)
            load_manager.read(2)  // removes ', ' padding
            character = load_manager.read(1)
            load_manager.read(2)  // removes ', ' padding
            destination = load_manager.read(2)

            if (character === '_')  //convert special character to epsilon
                character = ''

            if (!character in states[source].arrows)
                states[source].arrows[character] = []

            states[source].arrows[character].push(destination)
        }
        load_manager.close()
        startsCopy = Object.assign({},starts)
        alphabetCopy = Object.assign({},alphabet)
        statesCopy = Object.assign({},states)
        machines.push(Machine(startsCopy,alphabetCopy,statesCopy.slice()))
    }
    return machines
}

// performs user aided simulation on a specified machine
// Accepts: machine list, decision on which machine to use, strike count, attempt
// Returns: --- (could return point calculation?)
function run_level(machines,level,user_chances=3,user_entries=10) {
    var current_machine = machines[level];
    var stage_clear_flag = false;
    var valid_input_flag = true;
    while ((stage_clear_flag === false) && (user_chances > 1) && (user_entries > 0)) {
        user_entries--;

        if (valid_input_flag === false) {  //  if user made an incorrect guess
            user_chances--;  // lower chance count
            valid_input_flag === true;
            current_machine = machines[level];  // start simulation
            console.log("Strike! Start Over.");
        }

        // run simulation with user input
        // THIS IS SHOULD BE WHEN A SHAPE IS CLICKED
        var user_input = console.log("Enter a route.");
        var return_list = execute_input(current_machine, user_input);
        current_machine.current = return_list[0];
        stage_clear_flag = return_list[1];
        valid_input_flag = return_list[2];
    }

    // case: user solved puzzle
    if (stage_clear_flag === true) {
        console.log("Good Job!");
    }

    // case: user got too many strikes
    if (user_chances === 0) {
        console.log("Strike 3; You're out!");
    }

    // case: user took too many guesses to answer
    if (user_entries === 0) {
        console.log("You're out of entries!");
    }

    return;
}


// main code
 var machines = load_machines(["machines.txt"]);
run_level(machines,0);

