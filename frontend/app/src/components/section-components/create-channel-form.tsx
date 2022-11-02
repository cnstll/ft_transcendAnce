
import { Dispatch, useState } from "react";

import useCreateChannel from "../query-hooks/useCreateChannel";

interface CreateChannelFormProps {
  setShowForm: Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormData = {
  name: "",
  type: undefined,
  password: "",
}

function CreateChannelForm(props: CreateChannelFormProps) {
  // const queryClient = useQueryClient();
  const createChannelMutation = useCreateChannel();
  //const createChannelRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const { name, type, password } = formData;
  //const [inputStatus, setInputStatus] = useState<string>('empty');

  function OnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function OnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = createChannelMutation.mutate({ name: formData.name, type: formData.type, passwordHash: formData.password });
      console.log(res);
      props.setShowForm(false);
    } catch (error) {
      console.log(error);
    }
    setFormData(defaultFormData);
  }


  // export default function CreateChannel() {
  //   const mutation = useCreateChannel();

  //   return <><button type="button" onClick={() => mutation.mutate(channel)}>Create Channel</button></>
  // }


  // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  // border-radius: 6px;
  // background-color: white;
  // padding: 1rem;
  // text-align: center;
  // width: 30rem;
  // z-index: 10;
  // position: fixed;
  // top: 20vh;
  // left: calc(50% - 15rem);

  //   cursor: pointer;
  // border-radius: 4px;
  // background-color: #800040;
  // color: white;
  // border: 1px solid #800040;

  return <>
    <div className="absolute block p-4 rounded-lg shadow-lg w-80 bg-purple-light text-white text-xs sm:text-xs md:text-sm font-bold">
      <h2 className="text-center text-purple text-sm sm:text-sm md:text-lg font-bold my-3">Create a new channel</h2>
      <div className="grid gap-y-6">
        <form onSubmit={OnSubmit}>
          <div id="form-channel-creation-name"
            className="form-group mb-6 text-center text-white text-sm sm:text-sm md:text-base font-bold">
            <label htmlFor="ChannelName">Enter a name:</label>
            <input
              className={`form-control block w-full px-3 py-1.5 text-base font-normal bg-purple-light focus:bg-purple-light bg-clip-padding border-b-2 focus:outline-none`}
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={OnChange}
              autoComplete="off"
              placeholder="The name" />
          </div>
          <div id="form-channel-creation-type"
            className="form-group mb-6 text-center text-white text-sm sm:text-sm md:text-base font-bold">
            <label htmlFor="ChannelType">Enter a type:</label>
            <input
              className={`form-control block w-full px-3 py-1.5 text-base font-normal bg-purple-light focus:bg-purple-light bg-clip-padding border-b-2 focus:outline-none`}
              type="text"
              name="type"
              id="type"
              value={type}
              onChange={OnChange}
              autoComplete="off"
              placeholder="The type" />
          </div>
          <div id="form-channel-creation-password"
            className="form-group mb-6 text-center text-white text-sm sm:text-sm md:text-base font-bold">
            <label htmlFor="ChannelPassword">Enter a password:</label>
            <input
              className={`form-control block w-full px-3 py-1.5 text-base font-normal bg-purple-light focus:bg-purple-light bg-clip-padding border-b-2 focus:outline-none`}            type="text"
              name="password"
              id="password"
              value={password}
              onChange={OnChange}
              autoComplete="off"
              placeholder="The password" />
          </div>
            <button type="submit">
              Create
            </button>
        </form>
      </div>
    </div>
</>
}

export default CreateChannelForm;
