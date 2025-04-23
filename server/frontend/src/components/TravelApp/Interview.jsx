import React, { useCallback, useEffect, useReducer, useState } from "react";
import { createPortal } from "react-dom";
import "./interview.css";

const styles = {
  main: {},

  section: {
    background: "white",
    margin: 20,
    padding: 5,
  },
};

const Wrapper = ({ title, children }) => {
  return (
    <section style={styles.section}>
      <h1>{title}</h1>
      {children}
    </section>
  );
};

class MyClassComponent extends React.Component {
  state = {
    counter: 0,
  };

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }
  render() {
    return (
      <Wrapper title={this.props.title}>
        <button
          onClick={() => {
            this.setState({ counter: this.state.counter + 1 });
          }}
        >
          Counter {this.state.counter}
        </button>
      </Wrapper>
    );
  }
}

const MyFunctionalComponent = ({ title }) => {
  let counter = 0;

  return (
    <Wrapper title={title}>
      <button
        onClick={() => {
          counter = counter + 1;
          console.log({ counter });
        }}
      >
        Counter {counter}
      </button>
    </Wrapper>
  );
};

const MyFunctionalComponentWithState = ({ title }) => {
  const [counter, setCounter] = useState(0);
  return (
    <Wrapper title={title}>
      <button onClick={() => setCounter((oldValue) => oldValue + 1)}>
        Counter {counter}
      </button>
    </Wrapper>
  );
};

const ListOfUsers = ({ title, users = [] }) => {
  return (
    <Wrapper title={title}>
      {users.length === 0 && <p>No users</p>}
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </Wrapper>
  );
};

const ChildCommunicatesWithParent = ({ title, callback }) => {
  return (
    <Wrapper title={title}>
      <button onClick={() => callback("Hello dad!")}>Child is talking</button>
    </Wrapper>
  );
};

const MyUseEffectComponent = ({ title }) => {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  useEffect(() => {
    console.log("Triggered by counter1");
  }, [counter1]);

  return (
    <Wrapper title={title}>
      <button
        onClick={() => {
          setCounter1((old) => old + 1);
        }}
      >
        Counter {counter1}
      </button>
      <button
        onClick={() => {
          setCounter2((old) => old + 1);
        }}
      >
        Counter {counter2}
      </button>
    </Wrapper>
  );
};

const MyReducer = ({ title }) => {
  const initialState = {
    isLoading: false,
    error: null,
    data: [],
  };

  const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      case "fetchStart":
        return { ...state, isLoading: true };
      case "fetchEnd":
        return { ...state, isLoading: false, data: payload };
      case "fetchError":
        return { ...state, isLoading: false, data: [], error: payload };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function callAxios() {
      dispatch({ type: "fetchStart" });
      try {
        const response = await fetch("http://localhost:3030/fetchDealers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        dispatch({
          type: "fetchEnd",
          payload: await response.json(),
        });
      } catch (error) {
        dispatch({
          type: "fetchError",
          payload: "There was a network error",
        });
      }
    }

    callAxios();
  }, []);

  console.log({ state }, "MyReducer");

  return (
    <Wrapper title={title}>
      {state.isLoading && <h3>Loading...</h3>}
      {state.error && <h3 style={{ color: "red" }}>{state.error}</h3>}
      {state.data && !state.error && (
        <ListOfUsers users={state.data.map((dealer) => dealer.short_name)} />
      )}
    </Wrapper>
  );
};

const MyUseFetchHook = ({ title }) => {
  function useFetch(url) {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("MyUseFetchHook loaded");

    const doFetch = useCallback(function doFetch() {
      console.log("MyUseFetchHook doFetch");
      setIsLoading(true);
    }, []);

    useEffect(() => {
      if (!isLoading) {
        return;
      }
      console.log("MyUseFetchHook useFetch hook triggered!");
      async function asyncFetch() {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Error while fetching url");
          }
          const json = await response.json();
          setResponse(json);
        } catch (error) {
          setResponse(null);
          setError("Error while fetching url");
        } finally {
          setIsLoading(false);
        }
      }

      asyncFetch();
    }, [isLoading, url]);
    return [{ response, isLoading, error }, doFetch];
  }

  const [{ response, isLoading, error }, doFetch] = useFetch(
    "http://localhost:3030/fetchDealers"
  );

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return (
    <Wrapper title={title}>
      {isLoading && <h3>Loading...</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      {response && !error && (
        <ListOfUsers users={response.map((dealer) => dealer.short_name)} />
      )}
    </Wrapper>
  );
};

const MyUserLocalStorage = ({ title }) => {
  const useLocalStorage = (key, value) => {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return value;
      }
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : value;
      } catch (error) {
        console.log(error);
        return value;
      }
    });

    function setName(value) {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.log(error);
        }
      }
    }

    return [storedValue, setName];
  };

  const [name, setName] = useLocalStorage("foo", "bar");

  return (
    <Wrapper title={title}>
      <input
        type="text"
        placeholder="Enter a value"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <h3>Stored value: {name}</h3>
    </Wrapper>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div>
      <div className="modal-overlay">
        <div className="modal3">
          <div>
            <span className="modal-close-button" onClick={onClose}>
              X
            </span>
            <div className="modal-content">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

const MyModal = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Wrapper title={title}>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is the content</p>
      </Modal>
    </Wrapper>
  );
};

const ToggleButton = ({ title }) => {
  const [toggleStatus, setToggleStatus] = useState(false);
  console.log("ToggleButton is being rendered");
  return (
    <Wrapper title={title}>
      <button
        onClick={() => {
          setToggleStatus((oldValue) => !oldValue);
        }}
      >
        Toggle is {toggleStatus ? "ON" : "OFF"}
      </button>
    </Wrapper>
  );
};

const MyForm = ({ title }) => {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test$12s");
  const [email, setEmail] = useState("edgar.ram.rez@outlook.com");
  return (
    <Wrapper title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ username, password, email });
        }}
      >
        <div>
          <label>Email:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            value={email}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button>Submit</button>
      </form>
    </Wrapper>
  );
};

const Interview = () => {
  return (
    <main style={styles.main}>
      <header>Practice Practice Practice</header>
      <section>
        <MyClassComponent title="Hello I am a Class Component and I am old!!!" />
        <MyFunctionalComponent title="I am a Functional Component" />
        <MyFunctionalComponentWithState title="I am a Functional Components with Hooks" />
        <ListOfUsers
          title={"List of users"}
          users={["edgar", "paulina", "eva"]}
        />
        <ChildCommunicatesWithParent
          title={"Child talks to dad"}
          callback={(message) => console.log(message)}
        />
        <MyUseEffectComponent title={"Only Counter1 triggers useEffect"} />
        <MyUserLocalStorage title={"userLocalStorage hook"} />
        <MyModal title={"Modal demo"} />
        <ToggleButton title={"Toggle button"} />
        <MyForm title={"Form validation"} />

        <MyReducer title={"Call API and update state via Reducer"} />
        <MyUseFetchHook title={"useFetch custom hook"} />
      </section>
    </main>
  );
};

export default Interview;
