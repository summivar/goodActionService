import React, {ChangeEvent, FC, useState} from 'react';
import style from './listAddItem.module.scss';
import {GoodActionApi} from '@/services/api';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {addGoodAction, selectUserData} from '@/store/slices/user';

interface AddData {
  nameOfAction: string;
  descriptionOfAction: string;
}

const initialFormData: AddData = {
  nameOfAction: '',
  descriptionOfAction: ''
};

const ListAddItem: FC = () => {
  const [addData, setAddData] = useState<AddData>(initialFormData);
  const dispatch = useAppDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAddData((prevAddData) => ({
      ...prevAddData,
      [name]: value,
    }));
  };

  const handleAddAction = async () => {
    const authToken: string = localStorage.getItem('authToken') || '';
    try {
      const data = await GoodActionApi.add(addData, authToken);
      dispatch(addGoodAction(data));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={style.context}>
      <div className={style.item}>
        <label className={style.itemLabel}>Name Of Action: </label>
        <input className={style.itemInput} type="text" name="nameOfAction" value={addData.nameOfAction}
               onChange={handleInputChange}/>
      </div>
      <div className={style.item}>
        <label className={style.itemLabel}>Description Of Action</label>
        <input className={style.itemInput} type="text" name="descriptionOfAction" value={addData.descriptionOfAction}
               onChange={handleInputChange}/>
      </div>
      <div className={style.item}>
        <button className={style.itemButton} onClick={handleAddAction}
                disabled={!addData.nameOfAction || !addData.descriptionOfAction}>
          Add new action
        </button>
      </div>
    </div>
  );
};

export default ListAddItem;