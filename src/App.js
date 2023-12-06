import React, { useState, useEffect } from 'react';
import './App.css'; //labai basic css, tik kad padėtų atskirti elementus vienus nuo kitų

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({ name: '', surname: '', funds: '' });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  //pradžios duomenys
  useEffect(() => {
    const storedAccounts = localStorage.getItem('bankAccounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    } else {
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
      setAccounts(initialAccounts);
      localStorage.setItem('bankAccounts', JSON.stringify(initialAccounts));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Puslapiukas Kraunasi</p>;
  }

  const handleCloseField = () => {
    setSelectedAccount(null);
  };
  //žinutė
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
      alert('Nerasta');
    }
  };

  //operacijos
  //pridedu
  const handleAddFunds = () => {
    const addedFunds = parseFloat(newAccount.funds).toFixed(2);
    showNotification(`Pridėjom ${addedFunds} € į ${selectedAccount.name} ${selectedAccount.surname}.`);

    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, funds: acc.funds + parseFloat(newAccount.funds) }
          : acc
      );
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };
  //nuimu
  const handleDebitFunds = () => {
    const debitedFunds = parseFloat(newAccount.funds).toFixed(2);
    showNotification(`Nuėmėm ${debitedFunds} € nuo ${selectedAccount.name} ${selectedAccount.surname}.`);

    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, funds: acc.funds - parseFloat(newAccount.funds) }
          : acc
      );
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };
  //ištrinu
  const handleDeleteAccount = () => {
    showNotification(`Ištrynėm ${selectedAccount.name} ${selectedAccount.surname} Accountą.`);

    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.filter((acc) => acc.id !== selectedAccount.id);
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
    setSelectedAccount(null);
  };
  //naujas
  const handleCreateAccount = () => {
    showNotification(`Sukurėm naują ${newAccount.name} ${newAccount.surname} accountą.`);

    setAccounts((prevAccounts) => {
      const newId = prevAccounts.length + 1;
      const newAccountData = {
        id: newId,
        name: newAccount.name,
        surname: newAccount.surname,
        funds: 0,
      };

      // išrušiuoju ir naują Account
      const sortedAccounts = [...prevAccounts, newAccountData].sort((a, b) =>
        a.surname.localeCompare(b.surname)
      );

      localStorage.setItem('bankAccounts', JSON.stringify(sortedAccounts));
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
        {accounts?.map((account) => (
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
