import React, { useState, useEffect } from 'react';
import './App.css'; //labai basic css, tik kad padėtų atskirti elementus vienus nuo kitų

const App = () => { //naudojami
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({ name: '', surname: '', funds: '' });
  const [notification, setNotification] = useState(null); //žinutėms pasirodyti

  //pradžios duomenys
  useEffect(() => {
    const initialAccounts = [
      { id: 1, name: 'Gytis', surname: 'Masiulis', funds: 500 },
      { id: 2, name: 'Dainius', surname: 'Kupšas', funds: 1000 },
      { id: 3, name: 'Gintaras', surname: 'Einikis', funds: 10400 },
      { id: 4, name: 'Arvydas', surname: 'Sabonis', funds: 10560900 },
      { id: 5, name: 'Saulius', surname: 'Štombergas', funds: 166000 },
      { id: 6, name: 'Arvydas', surname: 'Macijauskas', funds: 1445000 },
      { id: 7, name: 'Antanas', surname: 'Sireika', funds: 10 },
      { id: 8, name: 'Darius', surname: 'Lukminas', funds: 630 },
      { id: 9, name: 'Donatas', surname: 'Slanina', funds: 9000 },
      { id: 10, name: 'Gintaras', surname: 'Krapikas', funds: 12000 },

    ];
    // išskirstyti pagal alfabetą, pagal pavarde
    const sortedAccounts = initialAccounts.slice().sort((a, b) => a.surname.localeCompare(b.surname));
    setAccounts(sortedAccounts);

  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000); // žinutė, bus 5 sekundes
  }; 
  //paieškos baras
  const handleSearch = () => {
    const foundAccount = accounts.find(
      (account) => account.surname.toLowerCase() === searchTerm.toLowerCase()
    );

    if (foundAccount) {
      setSelectedAccount(foundAccount);
    } else {
      alert('Account not found.');
    }
  };


  //redagacija - pridėti
  const handleAddFunds = () => {
    if (!selectedAccount || isNaN(newAccount.funds)) {
      return; 
    }
  
    const addedFunds = parseFloat(newAccount.funds).toFixed(2);
    showNotification(`Pridėjom ${addedFunds} € į ${selectedAccount.name} ${selectedAccount.surname}.`);
  
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, funds: acc.funds + parseFloat(newAccount.funds) }
          : acc
      )
    );
  };

 // redagacija - atimti
 const handleDebitFunds = () => {
  if (!selectedAccount || isNaN(newAccount.funds)) {
    alert('Please select an account and enter a valid amount.');
    return;
  }

  const debitedFunds = parseFloat(newAccount.funds).toFixed(2);
  showNotification(`Nuėmėm ${debitedFunds} € nuo ${selectedAccount.name} ${selectedAccount.surname}.`);

  setAccounts((prevAccounts) =>
    prevAccounts.map((acc) =>
      acc.id === selectedAccount.id
        ? { ...acc, funds: acc.funds - parseFloat(newAccount.funds) }
        : acc
    )
  );
};
 
  //redagacija - išrinti accountą
  const handleDeleteAccount = () => {
    if (!selectedAccount) {
      alert('Please select an account.');
      return;
    }
    showNotification(`Išrtynėm ${selectedAccount.name} ${selectedAccount.surname} Accountą.`);
    setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc.id !== selectedAccount.id));
    setSelectedAccount(null);
  };

  const handleCloseField = () => {
    setSelectedAccount(null);
  };

  // sukuriu naują Account
  const handleCreateAccount = () => {
    if (!newAccount.name || !newAccount.surname || isNaN(newAccount.funds)) {
      alert('Please enter valid name, surname, and funds.');
      return;
    }
  
    showNotification(`Sukurėm naują ${newAccount.name} ${newAccount.surname} accountą.`);
    setAccounts((prevAccounts) => {
      const newId = prevAccounts.length + 1;
      const newAccountData = {
        id: newId,
        name: newAccount.name,
        surname: newAccount.surname,
        funds: 0, // per default tai buvo paprašyta
      };
  
      // išrušiuoju ir naują Account
      const sortedAccounts = [...prevAccounts, newAccountData].sort((a, b) =>
        a.surname.localeCompare(b.surname)
      );
  
      setNewAccount({ name: '', surname: '', funds: '' });
      return sortedAccounts;
    });
  };
  return (
  
    <div className="App">
      <h1>Bankas APP</h1>
    
      <div className="search-bar">
        <h3>Surasti jau esantį Account`ą pagal pavardę</h3>
        <input
          type="text"
          placeholder="Įveskite pavardę"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Ieškoti Account`o</button>
      </div>

      <div className="create-account">
        <h3>Sukurti naują Account`ą, bet pradinė suma bus 0</h3>
        <input
          type="text"
          placeholder="Vardas"
          value={newAccount.name}
          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pavardė"
          value={newAccount.surname}
          onChange={(e) => setNewAccount({ ...newAccount, surname: e.target.value })}
        />

        <button onClick={handleCreateAccount} >Sukurti Account`ą</button>
      </div>

      {selectedAccount && (
        <div className="selected-account">
          <h2>{`${selectedAccount.name} ${selectedAccount.surname}`}</h2>
          <p>Suma: €{selectedAccount.funds.toFixed(2)}</p>
          <div className="transaction-buttons">
            <input
              type="number"
              placeholder="Įvesti sumą"
              value={newAccount.funds}
              onChange={(e) =>
                setNewAccount({ ...newAccount, funds: e.target.value })
              }
            />
            <button onClick={handleAddFunds}>Pridėti</button>
            <button onClick={handleDebitFunds}>Nuimit</button>
            <button onClick={handleDeleteAccount}>Ištirinti Account`ą</button>
            <button className="close-button" onClick={handleCloseField}>
              Uždaryti
            </button>
          </div>
        </div>
      )}
      <ol className="accounts-list">
        {accounts.map((account, index) => (
          <li key={account.id} className="account" onClick={() => setSelectedAccount(account)}>
            <strong>{`${account.name} ${account.surname}`}</strong>
            <p>Suma: €{account.funds.toFixed(2)}</p>
            {notification && <div className="notification">{notification}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;