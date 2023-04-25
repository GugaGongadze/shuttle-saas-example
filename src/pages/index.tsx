import Layout from "../components/Layout"
import React from 'react'

export default function Home() {

  let [email, setEmail] = React.useState<string>("");
   
  const handleSubscribe = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const url = `//${window.location.host}/api/subscribe`

    try {
      let res = await fetch(url, 
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email
          }),
        })

      if (res.ok) {
        let meme = document.querySelector("#emailfeedback") as HTMLParagraphElement;
        meme.innerHTML = "Subscribed."
      }
      
    } catch(e: any) {
      console.log(`Error: ${e}`)
    }

  }
  
  return (
  <>
      <Layout>
        <section className="my-10 flex flex-row justify-center gap-40">
        <h1 className="text-2xl lg:text-3xl w-1/3">Manage your customers quicker and easier, without the hassle.</h1>
        <p> Hello world! </p>
        </section>
              <section className="py-10">
        <h1 className="text-2xl lg:text-5xl text-center py-10">About</h1>
        <p>Zest CRM keeps ease of use in mind to let your manage your customers easily without information overload, while still providing powerful analytics that help you with your business. </p> 
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="py-10"> How can Zest help you? </h1>
            <div className="w-4/5 grid grid-cols-3 grid-rows-1 items-center justify-center gap-10">
              <div className="w-1/2 flex flex-row justify-center">
                <p className="text-center">A simple dashboard that lets you see all your stats at a glance</p>
                </div>
                            <div className="w-1/2 flex flex-row justify-center">
                <p className="text-center">A simple dashboard that lets you see all your stats at a glance</p>
                </div>
              <div className="w-1/2 flex flex-row justify-center">
                <p className="text-center">API integrations to let you integrate Zest into your workflow seamlessly</p>
                </div>

      </div>
      </div>
        </section>
        <section className="flex flex-col items-center gap-8">
            <p className="lg:text-3xl text-xl"> Subscribe to our mailing list and receive the latest updates. </p>
          <form className="flex flex-row justify-center gap-4" onSubmit={(e) => handleSubscribe(e)}>
            <input className="px-5 py-2" type="email" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)}></input>
            <button type="submit">Submit</button>
      </form>
          
            <p id="emailresponse"></p>
        </section>

    </Layout>
  </>
  )
}
