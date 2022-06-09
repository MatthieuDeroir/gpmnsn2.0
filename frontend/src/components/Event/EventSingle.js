import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'





const EventSingle = (props) => {

    let r_width = "100%"
    let r_height = "100%"

    function detectMob(){
        return ( ( window.innerWidth <= 800 ) || ( window.innerHeight <= 600 ) );
    }

    const isMobile = detectMob()

    if(!isMobile){
        r_width = "624px"
        r_height = "350px"
    }
    else{
        r_width = "100%"
        r_height = "100%"
    }

    if (props.event.files) {
        return (
            <div >
                <h2 style={{textAlign:"center", color:"white", backgroundColor:"#203038"}}> {props.event.name}</h2>
                <Carousel fade key={`${props.event._id}`} style={{width: {r_width}, height: {r_height}}}  >
                    {
                        //624px w, 350px h
                        props.event.files.map((item) => //dans l'idéal, height est dépendante = width/(screen_res)
                                                        //screen_res étant la résolution du panneau
                                                        //pour prévisualisation réaliste des médias
                                            //la duree est exprimee en millieme de seconde
                            <Carousel.Item interval={item.type === "image" ? item.duration*1000 : 5000} style={{width:"inherit",height: "inherit"}} >
                                    {(() => {
                                        switch (item.type) {
                                            case "image":
                                                return <img className="d-block w-100 h-100" src={`${item.path}`} alt="image"/>;
                                            case "video":
                                                return <video className="d-block w-100 h-100"
                                                src={`${item.path}`} autoPlay="1" muted="1" loop/>;
                                            default:
                                                return <p>Invalid Format</p>;
                                        }
                                    })()}
                                <Carousel.Caption>
                                   <h3> {item.name}</h3>
                                </Carousel.Caption>

                            </Carousel.Item>
                        )
                    }
                </Carousel>
            </div>
        );
    }
}

export default EventSingle;