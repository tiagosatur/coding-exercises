// DOM REFERENCES

const form = document.getElementById('user-form');
const generalErrors = document.getElementById('general-errors');
const userList = document.getElementById('user-list');
const userListSection = document.getElementById('user-list-section')
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const firstNameError = document.getElementById('first-name-error');
const lastNameError = document.getElementById('last-name-error');
const users = ["Lunna Blue", 'Sara Blue'];

// HANDLING DATA (users array, adding user)

function dispatchUsersChangedEvent() {
    document.dispatchEvent(new CustomEvent('users-changed'));
}

function addUser(fullName) {
    users.push(fullName);
    dispatchUsersChangedEvent();
}

// RENDERING
function showUserListSection() {
    if(users.length === 0) {
        userListSection.classList.add('hidden');
    } else {
        userListSection.classList.remove('hidden')
    }
}

function renderEditingItem({li, name, index }) {    
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('edit-input');
    input.name = 'editInput'
    input.value = name;

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save-btn');
    saveBtn.textContent = 'Save';

    // Handle save button click
    saveBtn.addEventListener('click', () => {
        const newName = input.value.trim();
        if(isValid(newName)) {
            users[index] = newName;
            dispatchUsersChangedEvent();
        }
    })

    // Handle enter and escape keys when editing
    input.addEventListener('keydown', (event) => {
        if(event.key === 'Enter') {
            saveBtn.click();
        } else if(event.key === 'Escape') {
            //re-render without editngIndex, cancels the update
            renderUserList(); 
        }
    })

    li.appendChild(input);
    li.appendChild(saveBtn);
    userList.appendChild(li);

    input.focus();
}


function renderUserList(editingIndex = -1) {
    userList.innerHTML = '';

    users.forEach((name, index) => {
        const li = document.createElement('li');

        const isEditing = index === editingIndex;

        if(isEditing) {
            renderEditingItem({ li, name, index });

        } else {
            const span = document.createElement('span');
            span.textContent = name;
            span.classList.add('label')
            
    
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => {
                users.splice(index, 1);
                dispatchUsersChangedEvent();
            });
    
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = '✎'; 
            editBtn.addEventListener('click', () => {
                renderUserList(index);
            })
            // Insert in HTML
            li.appendChild(span);
            userList.appendChild(li);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn)
        }
    });

    showUserListSection();
}

renderUserList();

// VALIDATION

function isValid(value) {
    return value !== '';
}

function validateInputs({ firstName, lastName }) {
    const isFirstValid = isValid(firstName);
    const isLastValid = isValid(lastName);

    if(!isFirstValid) {
        markInputInvalid({ inputElement: firstNameInput, errorElement: firstNameError })
    }

    if(!isLastValid) {
        markInputInvalid({ inputElement: lastNameInput, errorElement: lastNameError })
    }

    return isFirstValid && isLastValid;
}

function findDuplicateUser(fullName) {
    return users.some((user) => user.toLowerCase() === fullName.toLowerCase());
}

// ERROR HANDLING

function markInputInvalid({ inputElement, errorElement }) {
    inputElement.classList.add('invalid');
    errorElement.textContent = "Required field";
    errorElement.classList.add('invalid');
}

function resetFirstNameError() {
    firstNameInput.classList.remove('invalid');
    firstNameError.textContent = '';
    firstNameError.classList.remove('invalid');
}

function resetLastNameError() {
    lastNameInput.classList.remove('invalid');
    lastNameError.textContent = '';
    lastNameError.classList.remove('invalid');
}

function resetGeneralErrors() {
    generalErrors.classList.add('hidden');
}

function resetErrors() {
    resetGeneralErrors();
    resetFirstNameError();
    resetLastNameError();
}

function showDuplicateUserError() {
    generalErrors.textContent = "User already exists"
    generalErrors.classList.remove('hidden')
}


// FORM HANDLERS

function onFormSubmit() {
    resetErrors();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const areInputsValid = validateInputs({ firstName, lastName});

    if(!areInputsValid) return;

    const fullName = `${firstName} ${lastName}`;
    const isDuplicateUser =  findDuplicateUser(fullName);

    if(isDuplicateUser) {
        showDuplicateUserError();
        return;
    }

    addUser(fullName);
    form.reset()
}

// LISTENERS

form.addEventListener('submit', (event) => {
    event.preventDefault();
    onFormSubmit()
});

firstNameInput.addEventListener('input', function() {
    resetGeneralErrors();
    resetFirstNameError();
});

lastNameInput.addEventListener('input', function() {
    resetGeneralErrors();
    resetLastNameError();
});

document.addEventListener('users-changed', () => {
    renderUserList()
});


