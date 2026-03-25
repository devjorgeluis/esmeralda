import { useEffect } from "react";

const FullDivLoading = (props) => {
    useEffect(() => {
        if (props.show == true) {
            document
                .getElementById("games_container_overlay").style.display = "block";
        } else {
            document
                .getElementById("games_container_overlay").style.display = "none";
        }
    }, [props.show]);

    return (
        <div id="games_container_overlay" className="text-center">
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-green-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullDivLoading;
