import React, { useState } from 'react';
import { useAppContext } from "../../context/context";
import style from '../../styles/Proposal.module.css';
import { useRouter } from 'next/router';
const CreateProposal = () => {
  const router = useRouter();
  const { create_proposal } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateCRStart, setDateCRStart] = useState('');
  const [dateCREnd, setDateCREnd] = useState('');
  const [dateVRStart, setDateVRStart] = useState('');
  const [dateVREnd, setDateVREnd] = useState('');
  const [dateVSStart, setDateVSStart] = useState('');
  const [dateVSEnd, setDateVSEnd] = useState('');

  const createProposal =async () => {
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

    if(createdProposal){
      router.push(`/proposal/${createdProposal.publicKey}`);
    }
  };

  return (
    <div className={style.container}>
      <label className={style.label} htmlFor="title">Titre</label>
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
        type="textaera"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label className={style.label} htmlFor="date-input-cr">choices_registration:</label>
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
            onChange={(e) => setDateCREnd(e.target.value)}
          />
        </div>
      </div>
      <label className={style.label} htmlFor="date-input-vr">votes_registration:</label>
      <div className={style.group}>

        <div>
          <span className={style.group_label}>start</span>
          <input
            type="datetime-local"
            id="date-input-vr-start"
            className={style.input}
            value={dateVRStart}
            onChange={(e) => setDateVRStart(e.target.value)}
          />
        </div>
        <div>
          <span className={style.group_label}>end</span>
          <input
            type="datetime-local"
            id="date-input-vr-end"
            className={style.input}
            value={dateVREnd}
            onChange={(e) => setDateVREnd(e.target.value)}
          />
        </div>
      </div>
      <label className={style.label} htmlFor="date-input-vs">voting_session:</label>
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
      <a className={style.button} onClick={createProposal}>
        Creer un vote
      </a>
    </div>
  );
};

export default CreateProposal;
