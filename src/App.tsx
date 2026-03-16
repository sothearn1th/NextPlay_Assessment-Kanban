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
    </div>
  );
}