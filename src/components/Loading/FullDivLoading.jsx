import { useEffect } from "react";
import ImgLoader from "/src/assets/img/loader.gif";

const FullDivLoading = (props) => {
    useEffect(() => {
        if (props.show == true) {
            document
                .getElementById("holds-the-iframe").classList.remove("d-none");
        } else {
            document
                .getElementById("holds-the-iframe").classList.add("d-none");
        }
    }, [props.show]);

    return (
        <div id="holds-the-iframe" className="holds-the-iframe d-none">
            {/* <img src={ImgLoader} /> */}
        </div>
    );
};

export default FullDivLoading;
