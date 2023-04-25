import {useState, useRef, useCallback} from "react";
import classes from "./Table.module.css";
import MemoizedTableRow from "./component/TableRow/TableRow";
import { texts } from "./utils/texts.js";
import colors from "./utils/colors";

function Table({issues}) {
    //Optimization was performed and some variables were exported from the component and the same data was exported in one change.
    const arrayIssues =  new Array(issues.length).fill({
            checked: false,
            backgroundColor: colors.ffffff
        });
    const globalCheckboxRef = useRef(null);
    const [issuesState, setIssuesState] = useState(
       arrayIssues
    );

    const [globalSelectDeselectIsChecked, setGlobalSelectDeselectIsChecked] = useState(
        false
    );
    const [countRowsSelected, setCountRowsSelected] = useState(0);

    const handleChange = useCallback((position) => {
        const updatedIssuesState = issuesState.map((element, index) => {
            if (position === index) {
                return {
                    ...element,
                    checked: !element.checked,
                    backgroundColor: element.checked ? colors.ffffff : "#eeeeee"
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
    }, [issuesState]);

    const handleGlobalCheckbox = useCallback((total) => {
        //Using useRef for document.getElementById can be replaced with using ref to avoid searching for DOM elements on every state change.
        const globalCheckbox = globalCheckboxRef.current;
        let count = 0;

        issues.forEach((element) => {
            if (element.status === texts.open) {
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
    }, []);

    const handleGlobalSelect = useCallback((event) => {
        let {checked} = event.target;

        const checkedIssues = [];
        issues.forEach((element) => {
            if (element.status === texts.open) {
                checkedIssues.push({checked: true, backgroundColor: colors.eeeeee});
            } else {
                checkedIssues.push({checked: false, backgroundColor: colors.ffffff});
            }
        });

        checked ? setIssuesState(checkedIssues) : setIssuesState(arrayIssues);

        const totalSelected = (checked ? checkedIssues : arrayIssues)
            .map((element) => element.checked)
            .reduce((sum, currentState, index) => {
                if (currentState && issues[index].status === texts.open) {
                    return sum + issues[index].value;
                }
                return sum;
            }, 0);
        setCountRowsSelected(totalSelected);
        setGlobalSelectDeselectIsChecked((prevState) => !prevState);
    }, [issues, issuesState]);

    return (
        <table className={classes.table}>
            <thead>
            <tr>
                <th>
                    <input
                        ref={globalCheckboxRef}
                        className={classes.checkbox}
                        type={texts.checkbox}
                        name={texts.customCheckboxSelectDeselectAll}
                        value={texts.customCheckboxSelectDeselectAll}
                        checked={globalSelectDeselectIsChecked}
                        onChange={handleGlobalSelect}
                    />
                </th>
                <th className={classes.numChecked}>
                    {countRowsSelected
                        ? `${texts.selected} ${countRowsSelected}`
                        : texts.nothingSelected}
                </th>
            </tr>
            <tr>
                <th/>
                <th>{texts.name}</th>
                <th>{texts.message}</th>
                <th>{texts.status}</th>
            </tr>
            </thead>

            <tbody>
            {issues.map((issues, index) => <MemoizedTableRow 
            issues={issues} index={index}
             key={index} issuesState={issuesState}
             handle={() => handleChange(index)}/>
            )}
            </tbody>
        </table>
    );
}

export default Table;
