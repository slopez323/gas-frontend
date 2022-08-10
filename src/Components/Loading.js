import gif from "../Assets/gas-load.gif";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="">
        <img src={gif} alt="gas gif" />
      </div>
    </div>
  );
};

export default Loading;
