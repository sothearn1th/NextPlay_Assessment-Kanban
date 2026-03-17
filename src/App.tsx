export default function App()
{
  function handleClick()
  {
    console.log("clicked");
  }

  return (
    <div>
      <h1>Hello world</h1>
      <button onClick={handleClick}>Click me</button>
        <div> 
          <h1>Another section</h1>
          <button onClick={handleClick}>Click me too</button>
        </div>

        <div> 
          <h1>Yet another section</h1>
          <button onClick={handleClick}>Click me three</button>
        </div>
    </div>


  );
}