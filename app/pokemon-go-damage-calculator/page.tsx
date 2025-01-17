

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
            <img src="/favicon.ico" alt="Favicon" className="inline-block mr-2 favicon" />
            <h1 className="title">Pokémon GO Damage Calculator</h1>
            <p className="text-white text-lg">Calculate the damage output of your Pokémon in Pokémon GO! Simulate battles and raids, and find out the best moveset for your Pokémon.</p>
            <a href={"https://pokemongo-damage-calculator.vercel.app/"} className="w-full py-2 text-white bg-primary rounded-lg space-y-4 mb-4">
                <button className="w-full ">
                  Go to Calculator
                </button>
              </a>
        </div>
    );
}
