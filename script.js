var request = new XMLHttpRequest()
request.open('GET', 'https://statme-api.tk/v1/message/guild/507389389098188820/', true)
document.addEventListener('DOMContentLoaded', async ()=>{
    request.onload = async function() {
        if(request.status >= 200 && request.status < 400){

            const messages = JSON.parse(this.response)
            
            let 
                channels_id = new Set(),
                users_id = new Set()

            messages.forEach(message => {
                channels_id.add(message.channel_id)
                users_id.add(message.user_id)
            })

            channels_id = Array.from(channels_id)
            users_id = Array.from(users_id)

            function messageByDay(user_id){

                const day = 1000*60*60*24

                const userMessages = messages.filter(message => message.user_id === user_id)
                
                if(userMessages.length < 2) return 0

                const start = userMessages.sort((a,b) => a.created_timestamp - b.created_timestamp)[0].created_timestamp
                const time = Date.now() - start
                const days = time / day

                const result = Math.round( userMessages.length / days )

                return result

            }

            function messageOf(user_id){
                return messages.find(message => message.user_id === user_id)
            }
            
            const info = document.getElementById('info')
            info.innerHTML = `
                <header>
                    <h2> Activity by <a href="https://statme-api.tk/"> Statme </a> </h2>
                </header>
                <main>
                    <h3> Message count : ${messages.length} </h3>
                    <h3> Active channels : ${channels_id.length} </h3>
                    <h3> Active users : ${users_id.length} </h3>
                    <h4> TOP 10 ACTIVITY </h4>
                    <ol>
                        ${users_id
                            .sort((a,b) => messageByDay(b) - messageByDay(a))
                            .slice(0,10)
                            .map(user_id => `
                                <li>
                                    <img src="${messageOf(user_id).user_image}" alt="" height="16">
                                    <div>
                                        ${messageOf(user_id).user_name}
                                    </div>
                                    <div>
                                        ${messageByDay(user_id)} msg / day
                                    </div>
                                </li>
                            `).join('')
                        }
                    </ol>
                </main>
                <footer>
                    
                </footer>
            `
        }else{
            console.error('error', request.status)
        }
    }
    request.send()
})

function map(value, min, max, targetMin, targetMax) {
    return targetMin + (targetMax - targetMin) * ((value - min) / (max - min));
}