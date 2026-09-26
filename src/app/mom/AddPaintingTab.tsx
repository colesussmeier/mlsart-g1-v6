"use client";

import { useEffect, useRef, useState } from 'react';
import { uploadProduct } from '../actions/uploadProduct';
import { COLLECTIONS, PRICES, type Collection } from '../actions/productOptions';
import { callAdmin, formatMoney } from './adminClient';
import { Button, Notice } from './ui';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Kept well under the server action body limit, with room for the other form fields.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const MAX_EDGE_PX = 3000;

type Field = 'photo' | 'title' | 'size' | 'collection' | 'price';

export default function AddPaintingTab() {
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [size, setSize] = useState('');
    const [collection, setCollection] = useState<Collection | ''>('');
    const [price, setPrice] = useState<number | null>(null);
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
    const [status, setStatus] = useState<'idle' | 'preparing' | 'uploading'>('idle');
    const [failure, setFailure] = useState<string | null>(null);
    const [added, setAdded] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!photo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(photo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photo]);

    const busy = status !== 'idle';

    const pickPhoto = (file: File | undefined) => {
        if (!file) return;
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setErrors(current => ({ ...current, photo: "That file isn't a photo the shop can use. Please choose a JPG or PNG photo." }));
            return;
        }
        setPhoto(file);
        setErrors(current => ({ ...current, photo: undefined }));
    };

    const clearError = (field: Field) => setErrors(current => ({ ...current, [field]: undefined }));

    const reset = () => {
        setPhoto(null);
        setTitle('');
        setSize('');
        setCollection('');
        setPrice(null);
        setErrors({});
        setFailure(null);
        setAdded(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;

        const found: Partial<Record<Field, string>> = {};
        if (!photo) found.photo = 'Please choose a photo of the painting.';
        if (!title.trim()) found.title = 'Please give the painting a title.';
        if (!size.trim()) found.size = 'Please enter the size.';
        if (!collection) found.collection = 'Please pick a collection.';
        if (price === null) found.price = 'Please pick a price.';
        setErrors(found);
        setFailure(null);
        if (Object.keys(found).length > 0) return;

        setStatus('preparing');
        let upload: File;
        try {
            upload = await shrinkIfNeeded(photo);
        } catch (err) {
            console.error(err);
            setStatus('idle');
            setFailure("This photo couldn't be opened. Please try a different photo, or save it as a JPG first.");
            return;
        }

        const formData = new FormData();
        formData.set('image', upload);
        formData.set('title', title.trim());
        formData.set('size', size.trim());
        formData.set('collection', collection);
        formData.set('price', String(price));

        setStatus('uploading');
        const result = await callAdmin(idToken => uploadProduct(idToken, formData));
        setStatus('idle');
        if (result.ok) {
            setAdded(result.data.title);
        } else {
            setFailure(result.error);
        }
    };

    if (added) {
        return (
            <div className="rounded-xl border border-green-300 bg-green-50 px-8 py-12 text-center">
                <p className="text-5xl" aria-hidden="true">✓</p>
                <p className="mt-4 text-2xl font-semibold text-green-900">&ldquo;{added}&rdquo; is now in the shop!</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                        href={`/products/${encodeURIComponent(added)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50"
                    >
                        See it in the shop ↗
                    </a>
                    <Button onClick={reset}>Add another painting</Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-2">
            <div>
                <FieldLabel>Photo of the painting</FieldLabel>
                <label
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); pickPhoto(e.dataTransfer.files[0]); }}
                    className={`flex min-h-[22rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                        dragging ? 'border-custom-blue bg-custom-bg-blue' : errors.photo ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    {preview ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="The painting you chose" className="max-h-80 rounded-md object-contain" />
                            <span className="mt-3 text-lg font-medium text-custom-blue">Choose a different photo</span>
                        </>
                    ) : (
                        <>
                            <span className="text-5xl" aria-hidden="true">🖼️</span>
                            <span className="mt-3 text-xl font-medium text-custom-blue">Click here to choose a photo</span>
                            <span className="mt-1 text-gray-600">or drag the photo into this box</span>
                        </>
                    )}
                    <input
                        ref={fileInput}
                        type="file"
                        accept={ACCEPTED_TYPES.join(',')}
                        className="sr-only"
                        disabled={busy}
                        onChange={e => pickPhoto(e.target.files?.[0])}
                    />
                </label>
                <FieldError message={errors.photo} />
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <FieldLabel htmlFor="painting-title">Title</FieldLabel>
                    <input
                        id="painting-title"
                        type="text"
                        value={title}
                        disabled={busy}
                        onChange={e => { setTitle(e.target.value); clearError('title'); }}
                        placeholder="For example: Morning on the Hudson"
                        className={inputClass(errors.title)}
                    />
                    <p className="mt-1 text-gray-600">Customers see this. Each painting needs its own title.</p>
                    <FieldError message={errors.title} />
                </div>

                <div>
                    <FieldLabel htmlFor="painting-size">Size</FieldLabel>
                    <input
                        id="painting-size"
                        type="text"
                        value={size}
                        disabled={busy}
                        onChange={e => { setSize(e.target.value); clearError('size'); }}
                        placeholder='For example: 11" x 14"'
                        className={inputClass(errors.size)}
                    />
                    <FieldError message={errors.size} />
                </div>

                <fieldset disabled={busy}>
                    <legend className="mb-2 text-lg font-semibold">Collection</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {COLLECTIONS.map(option => (
                            <Choice key={option} name="collection" checked={collection === option} invalid={!!errors.collection}
                                onChange={() => { setCollection(option); clearError('collection'); }}>
                                {option}
                            </Choice>
                        ))}
                    </div>
                    <FieldError message={errors.collection} />
                </fieldset>

                <fieldset disabled={busy}>
                    <legend className="mb-2 text-lg font-semibold">Price of the original</legend>
                    <div className="grid grid-cols-4 gap-3">
                        {PRICES.map(option => (
                            <Choice key={option} name="price" checked={price === option} invalid={!!errors.price}
                                onChange={() => { setPrice(option); clearError('price'); }}>
                                {formatMoney(option).replace('.00', '')}
                            </Choice>
                        ))}
                    </div>
                    <FieldError message={errors.price} />
                </fieldset>

                {Object.values(errors).some(Boolean) && (
                    <Notice tone="error">Almost there. Please fix the items marked in red.</Notice>
                )}
                {failure && <Notice tone="error" title="The painting wasn't added">{failure}</Notice>}

                <Button type="submit" busy={busy} busyLabel={status === 'preparing' ? 'Getting the photo ready…' : 'Adding to the shop… this can take a moment'} className="w-full">
                    Add painting to the shop
                </Button>
            </div>
        </form>
    );
}

function Choice({ name, checked, invalid, onChange, children }: {
    name: string; checked: boolean; invalid: boolean; onChange: () => void; children: React.ReactNode;
}) {
    return (
        <label className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-3 py-3 text-lg font-medium transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-custom-blue/30 ${
            checked ? 'border-custom-blue bg-custom-bg-blue text-custom-blue' : invalid ? 'border-red-300 bg-white' : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}>
            <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
            {checked && <span className="mr-2" aria-hidden="true">✓</span>}
            {children}
        </label>
    );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
    const className = "mb-2 block text-lg font-semibold";
    return htmlFor ? <label htmlFor={htmlFor} className={className}>{children}</label> : <p className={className}>{children}</p>;
}

function FieldError({ message }: { message?: string }) {
    return message ? <p className="mt-2 text-lg text-red-700" role="alert">{message}</p> : null;
}

function inputClass(error?: string) {
    return `w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-custom-blue/30 disabled:bg-gray-100 ${error ? 'border-red-400' : 'border-gray-300'}`;
}

async function shrinkIfNeeded(file: File): Promise<File> {
    if (file.size <= MAX_UPLOAD_BYTES) return file;

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) throw new Error('The browser could not re-encode the photo');
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}
