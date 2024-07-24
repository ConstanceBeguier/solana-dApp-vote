import React, {useState, useEffect} from 'react';
import {useAppContext} from "../../context/context";
import style from '../../styles/Proposal.module.css';
import {useRouter} from 'next/router';

const CreateProposal = () => {
    const router = useRouter();
    const {create_proposal, error, setError, success, setSuccess, isCo} = useAppContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateCRStart, setDateCRStart] = useState('');
    const [dateCREnd, setDateCREnd] = useState('');
    const [dateVRStart, setDateVRStart] = useState('');
    const [dateVREnd, setDateVREnd] = useState('');
    const [dateVSStart, setDateVSStart] = useState('');
    const [dateVSEnd, setDateVSEnd] = useState('');

    const createProposal = async () => {
      if((new Date(dateCRStart).getTime() / 1000 ) > new Date(dateCREnd).getTime() / 1000){
        return setError('The interval for saving choices is bad.');
      }
      if((new Date(dateVRStart).getTime() / 1000 ) > new Date(dateVREnd).getTime() / 1000){
        return setError('The interval for saving voters is bad.');
      }
      if((new Date(dateVSStart).getTime() / 1000 ) > new Date(dateVSEnd).getTime() / 1000){
        return setError('The interval for saving voters is bad.');
      }
      if((new Date(dateVRStart).getTime() / 1000 ) < new Date(dateCREnd).getTime() / 1000){
        return setError('The start of voter registration must begin after the end of choice registration.');
      }
      if((new Date(dateVSStart).getTime() / 1000 ) < new Date(dateVREnd).getTime() / 1000){
        return setError('The start of voting must begin after the end of voter registration.');
      }
      const createdProposal = await create_proposal(
          title,
          description,
          new Date(dateCRStart).getTime() / 1000,
          new Date(dateCREnd).getTime() / 1000,
          new Date(dateVRStart).getTime() / 1000,
          new Date(dateVREnd).getTime() / 1000,
          new Date(dateVSStart).getTime() / 1000,
          new Date(dateVSEnd).getTime() / 1000,
      );

        if (createdProposal) {

            setTimeout(() => {
                redirect(createdProposal);
            }, 2000);
        }
    };
    const redirect = (pubKey) => {
        setSuccess('');
        router.push(`/proposal/${pubKey}`);
    }
    return (
        <div className={style.container}>
            <label className={style.label} htmlFor="title">Title</label>
            <input
                className={style.input}
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label className={style.label} htmlFor="description">Description</label>
            <input
                className={style.input}
                type="textarea"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label className={style.label} htmlFor="date-input-cr">Choices Registration:</label>
            <div className={style.group}>

                <div>
                    <span className={style.group_label}>start</span>
                    <input
                        type="datetime-local"
                        id="date-input-cr-start"
                        className={style.input}
                        value={dateCRStart}
                        onChange={(e) => setDateCRStart(e.target.value)}
                    />
                </div>
                <div>
                    <span className={style.group_label}>end</span>
                    <input
                        type="datetime-local"
                        id="date-input-cr-end"
                        className={style.input}
                        value={dateCREnd}
                        onChange={(e) => {
                            setDateCREnd(e.target.value);
                            setDateVRStart(e.target.value)
                        }}
                    />
                </div>
            </div>
            <label className={style.label} htmlFor="date-input-vr">Voters Registration:</label>
            <div className={style.group}>

                <div>
                    <span className={style.group_label}>start</span>
                    <input
                        type="datetime-local"
                        id="date-input-vr-start"
                        className={style.input}
                        value={dateVRStart}
                        onChange={(e) => {
                            setDateVRStart(e.target.value)
                        }}
                    />
                </div>
                <div>
                    <span className={style.group_label}>end</span>
                    <input
                        type="datetime-local"
                        id="date-input-vr-end"
                        className={style.input}
                        value={dateVREnd}
                        onChange={(e) => {
                            setDateVREnd(e.target.value)
                            setDateVSStart(e.target.value)
                        }}
                    />
                </div>
            </div>
            <label className={style.label} htmlFor="date-input-vs">Voting Session:</label>
            <div className={style.group}>

                <div>
                    <span className={style.group_label}>start</span>
                    <input
                        type="datetime-local"
                        id="date-input-vs-start"
                        className={style.input}
                        value={dateVSStart}
                        onChange={(e) => setDateVSStart(e.target.value)}
                    />
                </div>
                <div>
                    <span className={style.group_label}>end</span>
                    <input
                        type="datetime-local"
                        id="date-input-vs-end"
                        className={style.input}
                        value={dateVSEnd}
                        onChange={(e) => setDateVSEnd(e.target.value)}
                    />
                </div>
            </div>
            {(error) && <span className={style.error}>{error}</span>}
            {(success) && <span className={style.success}>{success}</span>}
            <a className={style.button} onClick={createProposal}>
                Create proposal
            </a>
        </div>
    );
};

export default CreateProposal;
