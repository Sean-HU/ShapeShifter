# state definition inherited from assignment 1
class State:
    def __init__(self, name):
        self.name = name  # the name of this State.
        self.isfinal = False  # Is this an "accept" State?

        self.arrows = {}  # character: [state names]
        # the keys in the 'arrows' dictionary will be the characters for the state
        # transitions. For an empty (epsilon) transition, the empty string ('') will
        # be used. All values will be a list of state names (even if there is only
        # one destination state for a character)

    def __str__(self):
        arrows = '\n'.join(["{ch}->({states})".format(ch=ch, states=','.join(states))
                            for ch, states in self.arrows.items()])
        return "State {name}{final}. Transitions: \n{arrows}".format(
            name=self.name, final=(" (Final)" if self.isfinal else ""),
            arrows=arrows)

# machine definition inherited from assignment 1
class Machine:
    def __init__(self, start, alphabet, states):
        self.start = start  # a list of the names of start states
        self.alphabet = alphabet  # this is a list of valid input characters
        self.states = states  # a dictionary of name: State
        self.current = {}  # a list responsible for holding its current states

    def __str__(self):
        return ("A machine over {{{alphabet}}} containing states {{{states}}}, " +
                "starting in {{{start}}}").format(
            alphabet=','.join(self.alphabet), states=','.join(self.states.keys()),
            start=','.join(self.start))


# modifies given machine based on passed character
# Accepts: machine's current states, single user entered character
# Returns: updated machine based on character, machine status
#
# NOTE: machine status can be the following:
#       > NOT ACCEPT STATE | VALID INPUT
#       > ACCEPT STATE FOUND | VALID INPUT
#       > NOT ACCEPT STATE | INVALID INPUT
def execute_input(m, character):
    valid_flag = False  # assume invalid until path is taken
    if len(m.current) == 0:  # if the dfa is just starting
        m.current = (m.start).copy()
    print("start:", m.current)
    m.current = check_epsilons(m)
    new_states = list()
    for state in new_states:
        if (state not in m.current):
            m.current.append(state)
    for state in m.current:
        if character in m.states[state].arrows:
            valid_flag = True
            for new_state in m.states[state].arrows[character]:
                if (new_state not in new_states):
                    new_states.append(new_state)
        else:
            continue
    m.current = new_states.copy()
    m.current = check_epsilons(m)
    print((character + ":"), m.current)
    for state in m.current:
        if (m.states[state].isfinal):
            return (m.current, True, valid_flag)
    print("current:", m.current)
    return (m.current, False, valid_flag)  # accept not reached, check for valid input


# manages any instance of epsilon
# Accepts: current machine
# Returns: updated list of states based on epsilon transitions
def check_epsilons(m):
    new_states = list()
    for state in m.current:
        new_states.append(state)
    for state in m.current:
        epsilon_loop = False
        if ('' in m.states[state].arrows):
            while True:
                epsilon_loop = True
                for epsilon_node in m.states[state].arrows['']:
                    if (epsilon_node not in new_states):
                        new_states.append(epsilon_node)
                        epsilon_loop = False
                if epsilon_loop == True:
                    break
    return new_states


# generates machines based on the passed files
# Accepts: array of file names
# Returns: list of machines based on file contents
def load_machines(file_names):
    machines = []
    for file_name in file_names:
        load_manager = open(file_name, "r")
        states = {}
        starts = []
        finals = []
        alphabet = []
        load_manager.read(1)  # removes 'Q' padding
        while (load_manager.read(1) != '\n'):  # checks for newline
            load_manager.read(1)  # skip over formatting space
            state = load_manager.read(2) # read a state
            states[state] = State(state)

        load_manager.read(2)  # removes 'E:' padding
        while (load_manager.read(1) != '\n'):  # checks for newline
            alphabet.append(load_manager.read(1))  # read a character

        load_manager.read(1)  # removes 's' padding
        while (load_manager.read(1) != '\n'):  # checks for newline
            load_manager.read(1)  # skip over formatting space
            starts.append(load_manager.read(2))  # read a state

        load_manager.read(1)  # removes 'F' padding
        while (load_manager.read(1) != '\n'):  # checks for newline
            load_manager.read(1)  # skip over formatting space
            states[load_manager.read(2)].isfinal = True  # update "final" status


        load_manager.read(2)  # removes 'd:' padding
        while (load_manager.read(1) != '~'): # while not end of file
            source = load_manager.read(2)
            load_manager.read(2)  # removes ', ' padding
            character = load_manager.read(1)
            load_manager.read(2)  # removes ', ' padding
            destination = load_manager.read(2)

            if character == '_':  #convert special character to epsilon
                character = ''

            if not(character in states[source].arrows):
                states[source].arrows[character] = []

            states[source].arrows[character].append(destination)
        load_manager.close()

        machines.append(Machine(starts[:],alphabet[:],states.copy()))
    return machines


# performs user aided simulation on a specified machine
# Accepts: machine list, decision on which machine to use, strike count, attempt
# Returns: --- (could return point calculation?)
def run_level(machines,level,user_chances=3,user_entries=10):
    current_machine = machines[level]
    stage_clear_flag = False
    valid_input_flag = True
    while((stage_clear_flag == False) and (user_chances > 1) and (user_entries > 0)):
        user_entries -= 1

        if(valid_input_flag == False):  #  if user made an incorrect guess
            user_chances -= 1  # lower chance count
            valid_input_flag == True
            current_machine = machines[level]  # start simulation
            print("Strike! Start Over.")

        # run simulation with user input
        user_input = input("Enter a route.")
        current_machine.current, stage_clear_flag, valid_input_flag = execute_input(current_machine, user_input)

    # case: user solved puzzle
    if(stage_clear_flag == True):
        print("Good Job!")

    # case: user got too many strikes
    if(user_chances == 0):
        print("Strike 3; You're out!")

    # case: user took too many guesses to answer
    if(user_entries == 0):
        print("You're out of entries!")

    return


# main code
machines = load_machines(["machines.txt"])
run_level(machines,0)

