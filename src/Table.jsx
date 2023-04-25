import {useState} from "react";
import classes from "./Table.module.css";

function Table({issues}) {
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
        const globalCheckbox = document.getElementById(
            "custom-checkbox-selectDeselectAll"
        );
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
            {issues.map(({name, message, status}, index) => {
                let issueIsOpen = status === "open";
                let handler = issueIsOpen ? () => handleChange(index) : null;
                let stylesTr = issueIsOpen
                    ? classes.openIssue
                    : classes.resolvedIssue;

                return (
                    <tr
                        className={stylesTr}
                        style={issuesState[index]}
                        key={index}
                        onClick={handler}
                    >
                        <td>
                            {issueIsOpen ? (
                                <input
                                    className={classes.checkbox}
                                    type={"checkbox"}
                                    id={`custom-checkbox-${index}`}
                                    name={name}
                                    value={name}
                                    checked={issuesState[index].checked}
                                    onChange={() => handleChange(index)}
                                />
                            ) : (
                                <input
                                    className={classes.checkbox}
                                    type={"checkbox"}
                                    disabled
                                />
                            )}
                        </td>
                        <td>{name}</td>
                        <td>{message}</td>
                        <td>
                            {issueIsOpen ? (
                                <span className={classes.greenCircle}/>
                            ) : (
                                <span className={classes.redCircle}/>
                            )}
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default Table;
