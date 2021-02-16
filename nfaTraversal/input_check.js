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
    console.log(m.current);
    console.log(m.start);
    if (m.current.length == 0) {  // if the dfa is just starting
        m.current = (m.start).slice();
    }
    console.log("start:", m.current);
    m.current = check_epsilons(m);
    var new_states = [];

    /*for (var i = 0; i < new_states.length; i++) {
        if (!(new_states[i] in m.current)) {
            m.current.push(state);
        }
    }*/
    for (var i = 0; i < m.current.length; i++) {
        if (character in m.states[m.current[i]].arrows) {
            valid_flag = true;
            for (var j = 0; j < m.states[m.current[i]].arrows[character].length; j++) {
                if (!(m.states[m.current[i]].arrows[character][j] in new_states)) {
                    new_states.push(m.states[m.current[i]].arrows[character][j]);
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
    for (var i = 0; i < m.current.length; i++) {
        if (m.states[m.current[i]].isfinal) {
            return [m.current, true, valid_flag];
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
    for (var i = 0; i < m.current.length; i++) {
        new_states.push(m.current[i]);
    }
    for (var i = 0; i < m.current.length; i++) {
        epsilon_loop = false;
        if ('' in m.states[m.current[i]].arrows) {
            while (true) {
                epsilon_loop = true;
                for (var j = 0; j < m.states[m.current[i]].arrows[''].length; j++) {
                    if (!(m.states[m.current[i]].arrows[''][j] in new_states)) {
                        new_states.push(m.states[m.current[i]].arrows[''][j]);
                        epsilon_loop = false;
                    }
                }
                if (epsilon_loop == true) {
                    break;
                }
            }
        }
    }
    return new_states;
}


// generates machines based on the passed levels
// Accepts: array of levels
// Returns: list of machines based on file contents
function load_machines(levels) {
    var machines = [];
    var states = {};
    var starts;
    var finals;
    var alphabet;
    var d;
    var source, character, destination;
    for (var i = 0; i < levels.length; i++) {
        console.log(levels[i]);
        switch (levels[i]) {
            case 0:
                temp_states = ["s2", "c1"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s2"];
                finals = ["c1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s2", "a", "c1"],
                        ["c1", "a", "s2"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 1:
                temp_states = ["s1", "s2", "c1", "c2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s2"];
                finals = ["s1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "s2"],
                        ["s2", "a", "c2"],
                        ["c1", "a", "s1"],
                        ["c2", "a", "c1"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 2:
                temp_states = ["s1", "s2", "c1", "c2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s2"];
                finals = ["s1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "c1"],
                        ["s2", "a", "s1"],
                        ["s2", "b", "c1"],
                        ["c1", "a", "c2"],
                        ["c2", "a", "s1"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 3:
                temp_states = ["s1", "c1", "t1", "t2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["t1"];
                finals = ["c1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "c1"],
                        ["s1", "b", "t1"],
                        ["c1", "a", "t2"],
                        ["t1", "a", "t2"],
                        ["t2", "a", "s1"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 4:
                temp_states = ["s1", "s2", "c1", "t1", "t2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s1"];
                finals = ["c1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "t2"],
                        ["s1", "b", "t1"],
                        ["s2", "a", "c1"],
                        ["c1", "a", "t2"],
                        ["t1", "a", "c1"],
                        ["t2", "a", "s2"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 5:
                temp_states = ["s2", "c1", "c2", "t1", "t2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s2"];
                finals = ["t1"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s2", "a", "c1"],
                        ["c1", "a", "t2"],
                        ["c1", "", "c2"],
                        ["c2", "a", "t1"],
                        ["t1", "a", "s2"],
                        ["t2", "a", "s2"],
                        ["t2", "a", "s2"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 6:
                temp_states = ["s1", "s2", "c1", "c2", "t1", "t2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s2"];
                finals = ["c2"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "c2"],
                        ["s2", "a", "t1"],
                        ["c1", "a", "t2"],
                        ["c1", "b", "c2"],
                        ["c2", "a", "s2"],
                        ["t1", "a", "s1"],
                        ["t1", "", "c1"],
                        ["t2", "a", "s2"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;

            case 7:
                temp_states = ["s1", "s2", "c1", "c2"];
                for (var x = 0; x < temp_states.length; x++) {
                    states[temp_states[x]] = new State(temp_states[x]);
                }
                alphabet = ["a", "b", "c"];
                starts = ["s1"];
                finals = ["c2"];
                for (var j = 0; j < finals.length; j++){
                    states[finals[j]].isfinal = true;
                }
                d =
                    [["s1", "a", "c2"],
                        ["s1", "b", "c1"],
                        ["s1", "c", "s2"],
                        ["s2", "a", "c1"],
                        ["s2", "b", "s1"],
                        ["s2", "c", "c2"],
                        ["c1", "a", "s1"],
                        ["c1", "b", "s2"],
                        ["c1", "c", "c2"],
                        ["c2", "a", "s1"],
                        ["c2", "b", "s2"],
                        ["c2", "c", "c1"]];
                for (var j = 0; j < d.length; j++) {
                    source = d[j][0];
                    character = d[j][1];
                    destination = d[j][2];
                    console.log(source);
                    if (!(character in states[source].arrows)) {
                        states[source].arrows[character] = [];
                    }
                    states[source].arrows[character].push(destination);
                }
                break;
        }
        var states_copy = {};
        for (var y in states){
            states_copy[y] = states[y];
        }
        machines.push(new Machine(starts.slice(), alphabet.slice(), states_copy));
    }
    return machines;
}

// performs user aided simulation on a specified machine
// Accepts: machine list, decision on which machine to use, strike count, attempt
// Returns: --- (could return point calculation?)
function run_level(machines,level,user_chances=3,user_entries=10) {
    var current_machine = machines[level];
    var stage_clear_flag = false;
    var valid_input_flag = true;
    while ((stage_clear_flag == false) && (user_chances > 1) && (user_entries > 0)) {
        user_entries--;

        if (valid_input_flag == false) {  //  if user made an incorrect guess
            user_chances--;  // lower chance count
            valid_input_flag == true;
            current_machine = machines[level];  // start simulation
            console.log("Strike! Start Over.");
        }

        // run simulation with user input
        // THIS IS SHOULD BE WHEN A SHAPE IS CLICKED
        var user_input = window.prompt("Enter a route.");
        var return_list = execute_input(current_machine, user_input);
        current_machine.current = return_list[0];
        stage_clear_flag = return_list[1];
        valid_input_flag = return_list[2];
    }

    // case: user solved puzzle
    if (stage_clear_flag == true) {
        console.log("Good Job!");
    }

    // case: user got too many strikes
    if (user_chances == 0) {
        console.log("Strike 3; You're out!");
    }

    // case: user took too many guesses to answer
    if (user_entries == 0) {
        console.log("You're out of entries!");
    }

    return;
}


// main code
var levels = [0];
var machines = load_machines(levels);
run_level(machines,0);
