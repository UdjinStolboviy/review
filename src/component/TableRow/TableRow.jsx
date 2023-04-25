
import classes from "./TableRow.module.css";

const TableRow = ({issues, index, issuesState, handle}) => {
    //A piece of code was moved and a component was made for better perception.
                let issueIsOpen = issues.status === "open";
                let handler = issueIsOpen ? () => handle() : null;
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
                                    name={issues.name}
                                    value={issues.name}
                                    checked={issuesState[index].checked}
                                    onChange={() => handle()}
                                />
                            ) : (
                                <input
                                    className={classes.checkbox}
                                    type={"checkbox"}
                                    disabled
                                />
                            )}
                        </td>
                        <td>{issues.name}</td>
                        <td>{issues.message}</td>
                        <td>
                            {issueIsOpen ? (
                                <span className={classes.greenCircle}/>
                            ) : (
                                <span className={classes.redCircle}/>
                            )}
                        </td>
                    </tr>
                );
}

export default TableRow;
