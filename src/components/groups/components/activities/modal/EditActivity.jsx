import { ActivityService } from "../services/ActivityService";
import { Button } from "primereact/button";
import { createPortal } from "react-dom";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import { useEffect, useState } from "react";
import { useModal } from "../../../../../contexts/ModalContext";

export const FIXME_bimester = ["Primeiro", "Segundo", "Terceiro", "Quarto"];
export const FIXME_categories = ["Prova", "Trabalho"];
export const FIXME_subjects = [
    "Arquitetura de Software",
    "Artes",
    "Banco de Dados",
    "Biologia",
    "Educação Física",
    "Física",
    "Geografia",
    "História",
    "Inglês",
    "Matemática",
    "Português",
    "Programação Orientada a Objetos",
    "Química",
    "Sociologia"
];

export default function EditActivity({ groupId, element, onHide })
{
    const activityService = new ActivityService();
    const [activity, setActivity] = useState({
        groupId: undefined,
        subject: "",
        bimester: "",
        category: undefined,
        due: undefined,
        description: ""
    });

    useEffect(() => {
        element !== undefined ? setActivity(element) : null;
    }, [element]);

    const {handle, visible} = useModal();

    return createPortal((
        <Dialog header="Nova Atividade" style={{width: "500px"}} visible={visible} onHide={() => handle()}>
            <div>
                <div>
                    <Dropdown placeholder="Matéria" value={activity.subject} onChange={(e) => setActivity({ ...activity, subject: e.value })} style={{marginRight: "10px", width: "170px"}} options={FIXME_subjects} />
                    <Dropdown placeholder="Bimestre" value={activity.bimester} onChange={(e) => setActivity({ ...activity, bimester: e.value })} style={{marginRight: "10px", width: "130px"}} options={FIXME_bimester} />
                    <Dropdown placeholder="Categoria" value={activity.category} onChange={(e) => setActivity({ ...activity, category: e.value })} style={{width: "140px"}} options={FIXME_categories} />
                </div>
                <InputMask value={activity.due} onChange={(e) => setActivity({ ...activity, due: e.target.value })} mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" style={{marginTop: "10px", width: "calc(500px - 40px)"}} />
                <InputText placeholder="Descrição" value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })} style={{marginTop: "10px", width: "calc(500px - 40px)"}} />
            </div>
            <Divider />
            <div style={{display: "flex", justifyContent: "right"}}>
            {
                element !== undefined ? (
                    <Button label="Salvar" icon="pi pi-check" onClick={() => {
                        activityService.update(groupId, activity.id, {
                            subject: activity.subject,
                            bimester: FIXME_bimester.indexOf(activity.bimester),
                            category: FIXME_categories.indexOf(activity.category),
                            due: moment(activity.due, "DD/MM/YYYY").toDate().getTime(),
                            description: activity.description
                        }).then(() => {
                            if (onHide) onHide();
                            handle();
                        });
                    }} />
                ) : (
                    <Button label="Criar" icon="pi pi-check" onClick={() => {
                        activityService.add(groupId, {
                            subject: activity.subject,
                            bimester: FIXME_bimester.indexOf(activity.bimester),
                            category: FIXME_categories.indexOf(activity.category),
                            due: moment(activity.due, "DD/MM/YYYY").toDate().getTime(),
                            description: activity.description
                        }).then(() => {
                            if (onHide) onHide();
                            handle();
                        });
                    }} />
                )
            }
            </div>
        </Dialog>
    ), document.querySelector("#modal-root"));
}
