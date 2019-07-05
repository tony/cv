import React from "react";

interface IState {
  myActivities: [];
}
interface IActivity {
  created_date: string;
  title: string;
  actor: number;
  accepted_date?: string;
  qa_url?: string;
  diff_url?: string;
  end_date?: string;
  start_date?: string;
}

const App: React.FC<IState> = () => {
  const [activities, setActivities] = React.useState<IActivity[] | null>([]);
  const fetchActivities = async () => {
    const { myActivities } = await import(
      /* webpackChunkName: "myData" */ "../../lib/data"
    );
    setActivities(myActivities as IActivity[]);
  };
  React.useEffect(() => {
    fetchActivities();
  });

  console.log("renderState", { activities });

  return (
    <div>
      <header>
        {activities &&
          activities.map((activity, idx) => (
            <div key={idx}>{activity.title}</div>
          ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
