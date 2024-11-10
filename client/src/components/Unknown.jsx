import "../../src/styles.css";

const Unknown = () => {
    return (
        <div id="unknownHolder">
            <div id="unknownErr">
            <div id="unknown1">Error 404</div>
            <div id="unknown2">Page not found</div>
            <div id="unknown3">This page either does not exist or you do not have permission to enter this page</div>
            <a id="unknown4" className="button" href="/">Back</a>
            </div>
        </div>
    )
}

export default Unknown