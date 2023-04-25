import {useState, useRef} from "react";
import classes from "./Table.module.css";
import TableRow from "./component/TableRow/TableRow";

function Table({issues}) {
    const globalCheckboxRef = useRef(null);
    const [issuesState, setIssuesState] = useState(
        new Array(issues.length).fill({
            checked: false,
            backgroundColor: "#ffffff"
        })
    );
    
    const [globalSelectDeselectIsChecked, setGlobalSelectDeselectIsChecked] = useState(
        false
    );
    const [countRowsSelected, setCountRowsSelected] = useState(0);

    const handleChange = (position) => {
        const updatedIssuesState = issuesState.map((element, index) => {
            if (position === index) {
                return {
                    ...element,
                    checked: !element.checked,
                    backgroundColor: element.checked ? "#ffffff" : "#eeeeee"
                };
            }
            return element;
        });
        setIssuesState(updatedIssuesState);

        const total = updatedIssuesState
            .map((el) => el.checked)
            .reduce((acu, currentState, index) => {
                if (currentState) {
                    return acu + issues[index].value;
                }
                return acu;
            }, 0);
        setCountRowsSelected(total);

        handleGlobalCheckbox(total);
    };

    const handleGlobalCheckbox = (total) => {
        //Using useRef for document.getElementById can be replaced with using ref to avoid searching for DOM elements on every state change.
        const globalCheckbox = globalCheckboxRef.current;
        let count = 0;

        issues.forEach((element) => {
            if (element.status === "open") {
                count += 1;
            }
        });

        if (total === 0) {
            globalCheckbox.indeterminate = false;
            setGlobalSelectDeselectIsChecked(false);
        }
        if (total > 0 && total < count) {
            globalCheckbox.indeterminate = true;
            setGlobalSelectDeselectIsChecked(false);
        }
        if (total === count) {
            globalCheckbox.indeterminate = false;
            setGlobalSelectDeselectIsChecked(true);
        }
    };

    const handleGlobalSelect = (event) => {
        let {checked} = event.target;

        const checkedIssues = [];
        issues.forEach((element) => {
            if (element.status === "open") {
                checkedIssues.push({checked: true, backgroundColor: "#eeeeee"});
            } else {
                checkedIssues.push({checked: false, backgroundColor: "#ffffff"});
            }
        });

        const uncheckedIssues = new Array(issues.length).fill({
            checked: false,
            backgroundColor: "#ffffff"
        });
        checked ? setIssuesState(checkedIssues) : setIssuesState(uncheckedIssues);

        const totalSelected = (checked ? checkedIssues : uncheckedIssues)
            .map((element) => element.checked)
            .reduce((sum, currentState, index) => {
                if (currentState && issues[index].status === "open") {
                    return sum + issues[index].value;
                }
                return sum;
            }, 0);
        setCountRowsSelected(totalSelected);
        setGlobalSelectDeselectIsChecked((prevState) => !prevState);
    };

    return (
        <table className={classes.table}>
            <thead>
            <tr>
                <th>
                    <input
                        ref={globalCheckboxRef}
                        className={classes.checkbox}
                        type={"checkbox"}
                        id={"custom-checkbox-selectDeselectAll"}
                        name={"custom-checkbox-selectDeselectAll"}
                        value={"custom-checkbox-selectDeselectAll"}
                        checked={globalSelectDeselectIsChecked}
                        onChange={handleGlobalSelect}
                    />
                </th>
                <th className={classes.numChecked}>
                    {countRowsSelected
                        ? `Selected ${countRowsSelected}`
                        : "Nothing selected"}
                </th>
            </tr>
            <tr>
                <th/>
                <th>Name</th>
                <th>Message</th>
                <th>Status</th>
            </tr>
            </thead>

            <tbody>
            {issues.map((issues, index) => <TableRow 
            issues={issues} index={index}
             key={index} issuesState={issuesState}
             handle={() => handleChange(index)}/>
            )}
            </tbody>
        </table>
    );
}

export default Table;
