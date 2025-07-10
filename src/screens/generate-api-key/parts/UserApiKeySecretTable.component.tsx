
import { TkDataTable } from "@components/ui/TkDataTable";
import { Column } from "primereact/column";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectLoginData } from "@redux/AuthSlice";
import { DeleteApiKeyButton } from "./deleteApiKeyButton";
import { toast } from "react-toastify";


interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}
interface ComponentCProps {
  refetchTrigger: boolean;
  triggerRefetch:  (value: boolean) => void;
}

export const UserApiKeySecretTable =({ refetchTrigger, triggerRefetch }: ComponentCProps) => {

    const loginData = useSelector(selectLoginData);
    const [apiList, setApiList] = useState<Product[]>([]);
    const [selection, setSelection] = useState<Array<{ id: string }>>([]);

    useEffect(() => {
        if(refetchTrigger) {
         fetch(`${process.env.REACT_APP_API_BASE}/api/token`,{
            method: "GET",
                    headers: new Headers({ 
                        "content-type": "application/json", 
                        "Authorization": loginData?.accessToken ? `${loginData.accessToken}` : "" 
                    })
                })
                .then((res) => res.json())
                .then(data => {
                    setApiList(data);
                    triggerRefetch(false);
                })
                .catch((err) => console.error(err));
            }
   
	}, [refetchTrigger]);

    const handleDeleteApiKey = (id: string) => {
        console.log("delete id", id);
        if (!id) {
            console.error("No ID provided for deletion.");
            return;
        }
        fetch(`${process.env.REACT_APP_API_BASE}/api/token/deactivate/${id}`, {
            method: "DELETE",
            headers: new Headers({ 
                "content-type": "application/json", 
                "Authorization": loginData?.accessToken ? `${loginData.accessToken}` : "" 
            })
        })
            .then((res) => {
                return res.json()})
            .then((e) => {
                if(e.status === "success") {
                     toast.success("Api Key deleted successfully.");
                    // Refetch the API list after deletion
                    triggerRefetch(true);
                    setSelection([]);
                }
            })
            .catch((err) => {
                console.error(err)
                toast.error("Failed to delete Api Key.");
            });
    }
    
    return (
            <>
                <div className="flex p-3 align-items-center card-flat">
                            <div className="mt-4 mr-3 mb-0 ml-0 font-bold ">API Key List</div>
                        </div>
                
                <TkDataTable
                    emptyMessage={
                        <div className="flex justify-content-center align-items-center">
                            <div className="mr-2">There are no Api keys yet.</div>
                        </div>
                    }
                    className="mb-3"
                    value={apiList as any[]}
                    // selectionMode="multiple"
                    onSelectionChange={(e) => {
                        console.log("selection changed", e.value);
                        // setSelection(e.value);
                    }}
                    selection={selection}
                >
                    <Column
                        header="API Key"
                        sortable
                        sortField={"name"}
                        body={(row) => {
                            return row.name;
                        }}
                    />
                    <Column
                        header="Group"
                        sortable
                        sortField={"groupName"}
                        body={(row) => {
                            return row.groupName;
                        }}
                    />
                    <Column
                        header="Actions"
                        body={(row) => {
                            return (
                                <div>
                                   <DeleteApiKeyButton deleteApiKey={() => handleDeleteApiKey(row.id)}/> 
                                </div>
                            );
                        }}
                    />
                </TkDataTable>
            </>
        );

}