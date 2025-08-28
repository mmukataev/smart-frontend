'use client';

import React, { useEffect, useState } from 'react';

import useUploadPhoto from "@/hooks/useUploadPhoto";
import useEmployeeProfile from "@/hooks/useEmployeeProfile";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

import Profile from "@/components/Profile";

export default function ProfilePage() {
    const locale = useLocale();
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    useEffect(() => {
        if (currentId) {
            console.log("Текущий ID профиля:", currentId);
        }
    }, [currentId]);

    const { uploadPhoto, uploading, error } = useUploadPhoto();
    const employeeId = localStorage.getItem('employee_id');
    console.log(employeeId)

    const {
        employee,
        loading,
        department,
        sector,
        position,
        fullName,
        getWorkDuration,
        getOnlineStatus,
        imageUrl,
    } = useEmployeeProfile(employeeId);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl); // Очищаем
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFile]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const success = await uploadPhoto(selectedFile);
        if (success) {
            setShowModal(false);
            window.location.reload();
        }
    };

    return (
        <>
            <Link href={`/${locale}/`} className="knopkaKotoruyuYaNeLubluNoAluaZastavilaMenyaEyoDelat h-[50px] flex items-center justify-center px-[30px] w-fit rounded">
                {locale === "ru" ? 'Назад' : 'Артқа'}
            </Link>
            <div className='max-w-[600px] mx-auto'>
                {(!currentId || currentId === employeeId) && (
                <div className="flex mb-4">
                    <button
                    onClick={() => setShowModal(true)}
                    className="bg-gray-100 text-[var(--customDark)] text-[16px] flex pr-4 items-center rounded"
                    >
                    <div className='w-[50px] h-[50px] flex items-center justify-center'>
                        <img src='/profile/image.svg' width={18}/>
                    </div>
                    {locale === "ru" ? 'Обновить фотографию' : 'Фотосуретті жаңарту'}
                    </button>
                </div>
                )}

                {currentId && currentId !== employeeId && (
                <div className="flex mb-4">
                    <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="bg-gray-100 text-[var(--customDark)] h-[50px] text-[16px] flex px-4 items-center rounded"
                    >
                    {locale === "ru" ? 'Назад' : 'Артқа'}
                    </button>
                </div>
                )}
                <Profile id={employeeId} onChangeId={setCurrentId} />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setSelectedFile(null);
                            }}
                            className="text-white w-fit hover:text-gray-100 text-[14px] p-4 bg-[rgba(0,0,0,0.2)] rounded"
                        >
                            {locale === "ru" ? 'Назад' : 'Артқа'}
                        </button>

                            <label className="w-full h-fit bg-white max-w-[800px] rounded-[10px] relative p-6 mt-6 flex flex-col items-center">
                                <div>
                                <img
                                    src={previewUrl || imageUrl}
                                    alt="Превью"
                                    className="w-[120px] h-[120px] rounded-full object-cover"
                                />
                                <p className='text-[12px] text-[var(--customGray)] text-center mt-[5px]'><b>{locale === "ru" ? 'Загрузите изображение' : 'Фотосуретті жүктеңіз'}</b></p>
                                
                                </div>
                                <h4 className='text-[16px] text-[var(--customDark)] text-center mt-[15px] leading-[18px]'><b>{fullName}</b></h4>
                                <p className='text-[12px] text-[var(--customGray)] text-center mt-[5px]'><b>{locale === "ru" ? position.ru : position.kz}</b></p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mb-4 block w-full hidden"
                                />
                            </label>
                        
                        <button onClick={handleUpload} className="flex-1 bg-gradient-custom text-white rounded px-4 py-2 hover:opacity-90 mt-6">
                            Обновить
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
