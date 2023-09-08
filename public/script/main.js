const url = 'http://localhost:3001/api/accounts';

let handleAddSubmit = async () => {
    let name = document.getElementById("namn").value;
    let saldo = document.getElementById("saldo").value;
    
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "saldo": saldo
        })
    })
    const created = await res.json();
    printAccounts();
}

let printAccounts = async () => {
    const box = document.getElementById('accountBox');
    const title = document.getElementById('accountTitle');
    
    
    const res = await fetch(url)
    const data = await res.json();
    let counter = 0;
    
    if (document.querySelector('ul')) {
        document.querySelector('ul').remove();
    }
    
    if (data.length <= 0) {
        return title.innerHTML = "There is no bank accounts. Add one below"
    } else {   
        const ul = document.createElement("ul")
        box.append(ul)
        data.forEach(account => {           
            let li = document.createElement("li")
            li.innerHTML = `
            <section >
            <h3>Kontonummer: ${account._id}</h3>
            <h4>Name: ${account.name}</h4>
            <h4>Saldo: ${account.saldo}kr</h4>
            </section>
            <section data-id="${counter}" id="buttonBox_${counter}">
            <button class="withdraw">Withdraw</button>
            <button class="deposit">Deposit</button>
            <button class="delete">Delete</button>
            </section>`; 
            ul.append(li)
            counter++;
        });
    }
    document.querySelectorAll('.withdraw').forEach(btn => {
        btn.addEventListener('click', event => {
            
            if (document.querySelector('form')) {
                document.querySelector('form').remove();
            }
            const form = document.createElement('form');
            const buttonBox = document.getElementById(`buttonBox_${event.target.parentNode.dataset.id}`);
            
            form.innerHTML = `
            <label for="amount">Withdraw amount: </label>
            <input type="number" name="amount" id="amount">
            <button id="accept" type="button">Accept</button>`;
            buttonBox.append(form)
            
            const id = data[event.target.parentNode.dataset.id];
            
            document.querySelector('#accept').addEventListener('click', async event => {
                const input = document.getElementById('amount').value;
                
                console.log(parseInt(input))
                console.log(parseInt(id.saldo))

                if (input.charAt(0) === "-" || input.charAt(0) === "0") {
                    const p = document.createElement('p').innerHTML = "Your amount must start with number between 1-9";
                    buttonBox.append(p)
                } else {
                if (parseInt(id.saldo) < parseInt(input)) {
                    const p = document.createElement('p').innerHTML = "Du kan inte ta ut mer än vad du har";
                    buttonBox.append(p)
                } else {
                    const res = await fetch(url+'/'+id._id, {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            saldo: parseInt(id.saldo) - parseInt(input)
                        })
                    });
                    const withdrawal = res.json();
                    printAccounts();
                }
            }
            });
        })
    })
    document.querySelectorAll('.deposit').forEach(btn => {
        btn.addEventListener('click', event => {
            
            const id = data[event.target.parentNode.dataset.id];
            if (document.querySelector('form')) {
                document.querySelector('form').remove();
            }
            const form = document.createElement('form');
            const buttonBox = document.getElementById(`buttonBox_${event.target.parentNode.dataset.id}`);
            
            form.innerHTML = `
            <label for="amount">Deposit amount: </label>
            <input type="number" name="amount" id="amount">
            <button id="accept" type="button">Accept</button>`;
            buttonBox.append(form)
            
            
            document.querySelector('#accept').addEventListener('click', async event => {
                const input = document.getElementById('amount').value;
                console.log(input.charAt(0))
                if (input.charAt(0) === "-" || input.charAt(0) === "0") {
                    const p = document.createElement('p').innerHTML = "Your amount must start with number between 1-9";
                    buttonBox.append(p)
                } else {
                    const res = await fetch(url+'/'+id._id, {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            saldo: parseInt(id.saldo) + parseInt(input)
                        })
                    });
                    const deposited = res.json()
                    printAccounts();
                }
                })
        })
    })
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', async event => {
            const id = data[event.target.parentNode.dataset.id]
            const res = await fetch(url+'/'+id._id, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "_id": id._id
                })
            });
            const deleted = res.json();
            printAccounts();
        })
    })
} 
printAccounts();
document.querySelector("#addBtn").addEventListener("click", () => {
    if (document.querySelector("#addForm")) {
        document.querySelector("#addForm").remove();
    }
    
    const addForm = document.createElement("form"); 
    addForm.setAttribute("id", "addForm")
    addForm.innerHTML = `
    <label for="namn">Namn:</label>
    <input type="text" name="namn" id="namn">
    <label for="saldo">Saldo:</label>
    <input type ="number" name="saldo" id="saldo">
    <button type="button" id="submit_button">Add</button>
    `
    document.querySelector("body").append(addForm)
    let formBtn = document.getElementById("submit_button")
    
    formBtn.addEventListener("click", handleAddSubmit)
})